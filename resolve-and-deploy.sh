#!/bin/bash

# resolve-and-deploy.sh
# Automates merge conflict resolution and deployment

set -e  # stop on error

echo "🔧 Resolving merge conflicts (keeping local version)..."
echo "========================================================"

# --------------------------------------------------------------------
# 1. Check if there are conflicts
# --------------------------------------------------------------------
if ! git diff --check --quiet; then
  echo "⚠️  Unresolved conflicts detected."
else
  echo "✅ No conflicts – nothing to resolve."
  exit 0
fi

# --------------------------------------------------------------------
# 2. Get list of unmerged files
# --------------------------------------------------------------------
unmerged=$(git diff --name-only --diff-filter=U)

if [ -z "$unmerged" ]; then
  echo "✅ No unmerged files found."
  exit 0
fi

echo "📄 Unmerged files:"
echo "$unmerged"
echo ""

# --------------------------------------------------------------------
# 3. Resolve each file using local version (--ours)
# --------------------------------------------------------------------
for file in $unmerged; do
  echo "👉 Resolving $file (keeping local version)..."
  git checkout --ours "$file"
  git add "$file"
done

# --------------------------------------------------------------------
# 4. Commit the merge
# --------------------------------------------------------------------
echo "📦 Committing resolved merge..."
git commit -m "Merge: resolved conflicts (kept local versions)"

# --------------------------------------------------------------------
# 5. Verify package.json is valid (if it exists)
# --------------------------------------------------------------------
if [ -f "package.json" ]; then
  echo "🔍 Checking package.json validity..."
  if node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))" 2>/dev/null; then
    echo "✅ package.json is valid."
  else
    echo "❌ package.json is still invalid. Attempting automatic fix..."
    # Use the fix-project.sh logic to repair JSON
    node -e "
      const fs = require('fs');
      const path = './package.json';
      let content = fs.readFileSync(path, 'utf8');
      // Remove conflict markers
      content = content.replace(/<<<<<<< .*\\n/g, '').replace(/=======\\n/g, '').replace(/>>>>>>> .*\\n/g, '');
      try {
        const parsed = JSON.parse(content);
        fs.writeFileSync(path, JSON.stringify(parsed, null, 2));
        console.log('✅ package.json repaired.');
      } catch (e) {
        console.error('❌ Could not repair package.json automatically.');
        process.exit(1);
      }
    "
    git add package.json
    git commit --amend --no-edit  # amend the merge commit
  fi
fi

# --------------------------------------------------------------------
# 6. (Optional) Run npm install and npm run build to verify
# --------------------------------------------------------------------
read -p "❓ Run 'npm install && npm run build' to test? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "📦 Installing dependencies..."
  npm install
  echo "🚀 Building..."
  npm run build
  echo "✅ Build successful!"
else
  echo "⏭️  Skipping build test."
fi

# --------------------------------------------------------------------
# 7. Push to origin
# --------------------------------------------------------------------
echo "📤 Pushing to origin main..."
git push origin main

echo "✅ Done! Vercel will redeploy automatically."o

