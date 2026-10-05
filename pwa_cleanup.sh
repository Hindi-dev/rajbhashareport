#!/bin/bash

echo "🚀 Starting PWA/Service Worker Cleanup for Vite/React Project"

# 1. Create a Self-Destroying Service Worker to immediately fix 404s and unregister old workers from client browsers
echo "📝 Creating self-destroying sw.js in public folder..."
mkdir -p public
cat << 'EOF' > public/sw.js
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.registration.unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach(client => client.navigate(client.url));
    });
});
EOF

# 2. Create a minimal valid manifest.json to fix the syntax error
echo "📝 Creating minimal manifest.json in public folder..."
cat << 'EOF' > public/manifest.json
{
  "name": "Rajbhasha QPR",
  "short_name": "Rajbhasha QPR",
  "start_url": "/",
  "display": "standalone"
}
EOF

# 3. Strip the VitePWA plugin from vite.config.js
echo "🧹 Removing VitePWA from vite.config.js..."
if [ -f "vite.config.js" ]; then
    # Create a backup
    cp vite.config.js vite.config.js.bak
    # Remove VitePWA imports and usages
    sed -i.bak -e '/VitePWA/d' vite.config.js
    echo "✅ Cleaned vite.config.js"
fi

# 4. Strip service worker registration from main entry point
echo "🧹 Removing Service Worker registration from React entry file (main.jsx)..."
if [ -f "src/main.jsx" ]; then
    sed -i.bak -e '/serviceWorker/d' -e '/virtual:pwa-register/d' src/main.jsx
    echo "✅ Cleaned src/main.jsx"
fi

# 5. Remove manifest link from index.html (optional, but requested earlier)
echo "🧹 Removing manifest link from index.html..."
if [ -f "index.html" ]; then
    sed -i.bak -e '/rel="manifest"/d' index.html
    echo "✅ Cleaned index.html"
fi

echo "🎉 Cleanup complete! Now run:"
echo "git add ."
echo "git commit -m "Fix PWA and Service worker 404 errors""
echo "git push"
