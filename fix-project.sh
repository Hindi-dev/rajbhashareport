#!/bin/bash

set -e  # stop on error

echo "🔧 Rajbhasha Portal – Project Fixer"
echo "===================================="

# --------------------------------------------------------------------
# 1. Fix package.json (merge extra JSON objects like "engines")
# --------------------------------------------------------------------
echo "📦 Fixing package.json..."
node -e "
const fs = require('fs');
const path = './package.json';
let content = fs.readFileSync(path, 'utf8');
try {
  JSON.parse(content);
  console.log('✅ package.json is already valid.');
  process.exit(0);
} catch (_) {
  console.log('⚠️  package.json is invalid – attempting repair...');
}
let depth = 0, start = content.indexOf('{'), end = -1;
for (let i = start; i < content.length; i++) {
  if (content[i] === '{') depth++;
  if (content[i] === '}') depth--;
  if (depth === 0) { end = i; break; }
}
if (start === -1 || end === -1) {
  console.error('❌ Could not find a valid JSON object.');
  process.exit(1);
}
const mainStr = content.slice(start, end + 1);
const rest = content.slice(end + 1).trim();
let mainObj = JSON.parse(mainStr);
if (rest.length > 0) {
  try {
    const extra = JSON.parse(rest);
    for (const key of Object.keys(extra)) {
      if (!mainObj.hasOwnProperty(key)) mainObj[key] = extra[key];
      else console.warn('⚠️  Skipping duplicate key:', key);
    }
  } catch (e) {
    const match = rest.match(/\"(\w+)\"\s*:\s*(\{[^}]*\})/);
    if (match) {
      const key = match[1];
      const value = JSON.parse(match[2]);
      mainObj[key] = value;
      console.log('✅ Extracted and merged:', key);
    }
  }
}
fs.writeFileSync(path, JSON.stringify(mainObj, null, 2));
console.log('✅ package.json repaired.');
"

# --------------------------------------------------------------------
# 2. Install dependencies (ensures vite is available)
# --------------------------------------------------------------------
echo "📦 Installing dependencies (npm install)..."
npm install

# --------------------------------------------------------------------
# 3. Detect the real entry file in src/
# --------------------------------------------------------------------
echo "🔍 Detecting entry file in src/..."

# List of possible entry files (in order of preference)
possible_entries=(
  "src/index.js"
  "src/index.jsx"
  "src/main.js"
  "src/main.jsx"
  "src/App.jsx"
  "src/App.js"
)

ENTRY=""
for f in "${possible_entries[@]}"; do
  if [[ -f "$f" ]]; then
    ENTRY="$f"
    echo "✅ Found entry: $ENTRY"
    break
  fi
done

# If no entry found, create a minimal index.js
if [[ -z "$ENTRY" ]]; then
  echo "⚠️  No entry file found. Creating src/index.js..."
  mkdir -p src
  cat > src/index.js <<'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
  # Also create a minimal App component if missing
  if [[ ! -f "src/App.js" && ! -f "src/App.jsx" ]]; then
    echo "   (creating src/App.jsx)"
    cat > src/App.jsx <<'EOF'
export default function App() {
  return <h1>राजभाषा पोर्टल</h1>;
}
EOF
  fi
  ENTRY="src/index.js"
  echo "✅ Created entry: $ENTRY"
fi

# Ensure the entry file exists now (should)
if [[ ! -f "$ENTRY" ]]; then
  echo "❌ Could not find or create entry file. Exiting."
  exit 1
fi

# --------------------------------------------------------------------
# 4. Update index.html to use the correct entry
# --------------------------------------------------------------------
echo "📄 Updating index.html script src..."

# Determine the correct script src path (relative to index.html, with leading /src/...)
# The entry file is like "src/index.js" -> we need "/src/index.js" in HTML
REL_PATH="/${ENTRY}"   # converts "src/index.js" to "/src/index.js"

# Use sed to replace the <script> tag's src attribute
# We look for <script type="module" src="..."> and replace the src.
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS sed needs -i '' for no backup
  sed -i '' -E "s|<script[[:space:]]+type=\"module\"[[:space:]]+src=\"[^\"]*\"|<script type=\"module\" src=\"$REL_PATH\"|g" index.html
else
  sed -i -E "s|<script[[:space:]]+type=\"module\"[[:space:]]+src=\"[^\"]*\"|<script type=\"module\" src=\"$REL_PATH\"|g" index.html
fi

echo "✅ Updated script src to: $REL_PATH"

# --------------------------------------------------------------------
# 5. Run the build
# --------------------------------------------------------------------
echo "🚀 Running npm run build..."
npm run build

echo "✅ Build completed successfully! Check the 'dist' folder."
