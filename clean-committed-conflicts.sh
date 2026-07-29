#!/bin/bash

set -e

echo "🧹 Cleaning committed conflict markers..."
echo "========================================="

# --------------------------------------------------------------------
# 1. Find files containing conflict markers
# --------------------------------------------------------------------
files_with_conflicts=$(grep -r -l -E '^<<<<<<< |^=======$|^>>>>>>> ' --include="*.json" --include="*.js" --include="*.html" . 2>/dev/null || true)

if [ -z "$files_with_conflicts" ]; then
  echo "✅ No conflict markers found in any files."
  exit 0
fi

echo "📄 Files with conflict markers:"
echo "$files_with_conflicts"
echo ""

# --------------------------------------------------------------------
# 2. For each file, remove markers keeping HEAD (our) version
# --------------------------------------------------------------------
for file in $files_with_conflicts; do
  echo "🔧 Cleaning $file..."
  # Remove conflict markers: keep everything between <<<<<<< HEAD and =======,
  # then discard everything after >>>>>>>.
  # We'll use sed to delete the lines with markers and the remote section.
  # Approach: use a script to keep only the HEAD version.
  # This removes lines starting with <<<<<<<, =======, >>>>>>>, and also the remote block.
  # We'll use awk to print only the first part until =======, then stop before >>>>>>>.
  # Actually simpler: use sed to delete marker lines and the entire remote section.
  # But careful: we want to keep the HEAD content, not merge.
  # We'll use a Python one-liner to parse.
  # Using node to process:
  node -e "
    const fs = require('fs');
    const path = '$file';
    let content = fs.readFileSync(path, 'utf8');
    // Replace conflict markers: keep the HEAD version (between <<<<<<< HEAD and =======)
    // Remove everything after ======= up to >>>>>>>.
    content = content.replace(/<<<<<<< .*\\n([\\s\\S]*?)\\n=======\\n[\\s\\S]*?\\n>>>>>>> .*\\n?/g, '\$1\n');
    // Also handle if there are no markers but just the markers alone (edge case)
    fs.writeFileSync(path, content);
    console.log('  ✅ Cleaned $file');
  "
done

# --------------------------------------------------------------------
# 3. Verify package.json (if it was cleaned)
# --------------------------------------------------------------------
if [ -f "package.json" ]; then
  echo "🔍 Validating package.json..."
  if node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))" 2>/dev/null; then
    echo "✅ package.json is valid."
  else
    echo "❌ package.json is still invalid. Attempting auto-repair..."
    # Run the JSON repair logic (merge extra objects)
    node -e "
      const fs = require('fs');
      const path = './package.json';
      let content = fs.readFileSync(path, 'utf8');
      // Try to parse; if fails, attempt to merge extra objects
      try {
        JSON.parse(content);
      } catch (_) {
        // Extract main object and merge rest
        let depth = 0, start = content.indexOf('{'), end = -1;
        for (let i = start; i < content.length; i++) {
          if (content[i] === '{') depth++;
          if (content[i] === '}') depth--;
          if (depth === 0) { end = i; break; }
        }
        const mainStr = content.slice(start, end + 1);
        const rest = content.slice(end + 1).trim();
        const mainObj = JSON.parse(mainStr);
        if (rest.length > 0) {
          try {
            const extra = JSON.parse(rest);
            Object.assign(mainObj, extra);
          } catch (e) {
            // Try to extract key-value like "engines": {...}
            const match = rest.match(/\"(\w+)\"\s*:\s*(\{[^}]*\})/);
            if (match) mainObj[match[1]] = JSON.parse(match[2]);
          }
        }
        fs.writeFileSync(path, JSON.stringify(mainObj, null, 2));
        console.log('✅ package.json repaired.');
      }
    "
    # Re-add the repaired file
    git add package.json
  fi
fi

# --------------------------------------------------------------------
# 4. Add and commit the changes
# --------------------------------------------------------------------
echo "📦 Staging cleaned files..."
git add $files_with_conflicts 2>/dev/null || true
git add package.json 2>/dev/null || true

if git diff --cached --quiet; then
  echo "✅ No changes to commit."
else
  echo "📝 Committing conflict marker removal..."
  git commit -m "Remove conflict markers (kept local HEAD version)"
fi

# --------------------------------------------------------------------
# 5. Push to origin
# --------------------------------------------------------------------
echo "📤 Pushing to origin main..."
git push origin main

echo "✅ Done! Vercel will now redeploy with the fixed package.json."
