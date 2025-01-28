const { execSync } = require('child_process');

console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

console.log('Building project...');
execSync('npm run build', { stdio: 'inherit' });