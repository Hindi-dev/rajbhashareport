#!/bin/bash

# fix-package-json.sh – repairs invalid package.json (e.g., "engines" outside main object)

echo "🔍 Checking package.json..."

# Use Node to parse and fix
node -e "
const fs = require('fs');
const path = './package.json';

let content = fs.readFileSync(path, 'utf8');

// 1. Try to parse the whole file
try {
  const parsed = JSON.parse(content);
  console.log('✅ package.json is valid.');
  process.exit(0);
} catch (_) {
  console.log('⚠️  package.json is invalid – attempting repair...');
}

// 2. Extract the first main object (from first '{' to matching '}')
let depth = 0;
let start = content.indexOf('{');
let end = -1;
for (let i = start; i < content.length; i++) {
  if (content[i] === '{') depth++;
  if (content[i] === '}') depth--;
  if (depth === 0) { end = i; break; }
}
if (start === -1 || end === -1) {
  console.error('❌ Could not find a valid JSON object in package.json.');
  process.exit(1);
}

const mainObjStr = content.slice(start, end + 1);
const rest = content.slice(end + 1).trim();

// 3. Parse the main object
let mainObj;
try {
  mainObj = JSON.parse(mainObjStr);
} catch (e) {
  console.error('❌ Main object is still invalid JSON:', e.message);
  process.exit(1);
}

// 4. If there is extra content, try to extract a second object (likely "engines")
if (rest.length > 0) {
  // Try to parse the rest as a JSON object
  try {
    const extra = JSON.parse(rest);
    // Merge extra fields into mainObj (if they don't conflict)
    for (const key of Object.keys(extra)) {
      if (!mainObj.hasOwnProperty(key)) {
        mainObj[key] = extra[key];
      } else {
        console.warn('⚠️  Skipping duplicate key:', key);
      }
    }
  } catch (e) {
    // If rest is not a valid object, try to extract a key-value like "engines": {...}
    // Use a regex to find patterns like "engines": { ... }
    const match = rest.match(/\"(\w+)\"\s*:\s*(\{[^}]*\})/);
    if (match) {
      const key = match[1];
      const value = match[2];
      try {
        const parsedValue = JSON.parse(value);
        mainObj[key] = parsedValue;
        console.log('✅ Extracted and merged:', key);
      } catch (_) {
        console.warn('⚠️  Could not parse value for key:', key);
      }
    } else {
      console.warn('⚠️  Unrecognised extra content – ignoring.');
    }
  }
}

// 5. Write back the repaired JSON (with indentation)
fs.writeFileSync(path, JSON.stringify(mainObj, null, 2));
console.log('✅ package.json repaired and saved.');
"

# 6. Verify it's now valid
if npm run build --dry-run &>/dev/null; then
  echo "✅ Build check passed – package.json is fixed!"
else
  echo "⚠️  The file seems fixed, but 'npm run build' still fails. Please review manually."
fi
