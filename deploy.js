import { execSync } from 'child_process'

try {
  console.log('🔍 Checking Catalyst CLI...')
  execSync('catalyst --version', { stdio: 'inherit' })
} catch {
  console.log('⚙️ Installing Catalyst CLI...')
  execSync('sudo npm install -g zcatalyst-cli@latest', { stdio: 'inherit' })
}

console.log('🏗️ Building app...')
execSync('npm run build', { stdio: 'inherit' })

console.log('🚀 Deploying to Zoho Catalyst...')
execSync('catalyst deploy --target production', { stdio: 'inherit' })

