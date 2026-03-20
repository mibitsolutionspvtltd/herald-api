#!/usr/bin/env node

/**
 * Deployment Preparation Script
 * Checks if your app is ready for deployment
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('\n🚀 Student Herald API - Deployment Preparation\n');
console.log('='.repeat(50));

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

// Check 1: package.json exists
console.log('\n📦 Checking package.json...');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  checks.passed.push('package.json found');
  
  // Check start script
  if (pkg.scripts && pkg.scripts.start) {
    checks.passed.push('Start script defined');
  } else {
    checks.failed.push('No start script in package.json');
  }
  
  // Check dependencies
  const requiredDeps = ['express', 'sequelize', 'mysql2', 'dotenv', 'jsonwebtoken'];
  const missing = requiredDeps.filter(dep => !pkg.dependencies[dep]);
  if (missing.length === 0) {
    checks.passed.push('All required dependencies present');
  } else {
    checks.failed.push(`Missing dependencies: ${missing.join(', ')}`);
  }
} else {
  checks.failed.push('package.json not found');
}

// Check 2: .env.example exists
console.log('\n🔐 Checking environment configuration...');
if (fs.existsSync('.env.example')) {
  checks.passed.push('.env.example found');
  const envExample = fs.readFileSync('.env.example', 'utf8');
  
  const requiredVars = [
    'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
    'JWT_SECRET', 'FRONTEND_URL'
  ];
  
  const missingVars = requiredVars.filter(v => !envExample.includes(v));
  if (missingVars.length === 0) {
    checks.passed.push('All required environment variables documented');
  } else {
    checks.warnings.push(`Missing in .env.example: ${missingVars.join(', ')}`);
  }
} else {
  checks.warnings.push('.env.example not found');
}

// Check 3: server.js exists
console.log('\n🖥️  Checking server file...');
if (fs.existsSync('server.js')) {
  checks.passed.push('server.js found');
} else {
  checks.failed.push('server.js not found');
}

// Check 4: Migrations exist
console.log('\n🗄️  Checking database migrations...');
if (fs.existsSync('migrations')) {
  const migrations = fs.readdirSync('migrations').filter(f => f.endsWith('.sql'));
  if (migrations.length > 0) {
    checks.passed.push(`${migrations.length} migration file(s) found`);
  } else {
    checks.warnings.push('No SQL migration files found');
  }
} else {
  checks.warnings.push('migrations directory not found');
}

// Check 5: .gitignore exists
console.log('\n📝 Checking .gitignore...');
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const shouldIgnore = ['node_modules', '.env', 'logs'];
  const missing = shouldIgnore.filter(item => !gitignore.includes(item));
  
  if (missing.length === 0) {
    checks.passed.push('.gitignore properly configured');
  } else {
    checks.warnings.push(`.gitignore missing: ${missing.join(', ')}`);
  }
} else {
  checks.warnings.push('.gitignore not found');
}

// Check 6: Health check endpoint
console.log('\n🏥 Checking health endpoint...');
if (fs.existsSync('routes/health.js')) {
  checks.passed.push('Health check route found');
} else {
  checks.warnings.push('Health check route not found (recommended)');
}

// Check 7: README exists
console.log('\n📚 Checking documentation...');
if (fs.existsSync('README.md')) {
  checks.passed.push('README.md found');
} else {
  checks.warnings.push('README.md not found');
}

// Print Results
console.log('\n' + '='.repeat(50));
console.log('\n📊 RESULTS:\n');

if (checks.passed.length > 0) {
  console.log('✅ PASSED:');
  checks.passed.forEach(check => console.log(`   ✓ ${check}`));
}

if (checks.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  checks.warnings.forEach(check => console.log(`   ! ${check}`));
}

if (checks.failed.length > 0) {
  console.log('\n❌ FAILED:');
  checks.failed.forEach(check => console.log(`   ✗ ${check}`));
}

// Generate JWT Secret
console.log('\n' + '='.repeat(50));
console.log('\n🔑 GENERATED JWT SECRET:\n');
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log(jwtSecret);
console.log('\n💡 Copy this for your JWT_SECRET environment variable');

// Final verdict
console.log('\n' + '='.repeat(50));
if (checks.failed.length === 0) {
  console.log('\n✅ Your app is ready for deployment!');
  console.log('\nNext steps:');
  console.log('1. Push your code to GitHub');
  console.log('2. Choose a hosting platform (see FREE_DEPLOYMENT_GUIDE.md)');
  console.log('3. Follow the deployment guide');
  console.log('4. Add environment variables (including JWT_SECRET above)');
  console.log('5. Deploy and test!\n');
} else {
  console.log('\n❌ Please fix the failed checks before deploying.\n');
  process.exit(1);
}

console.log('📖 Deployment guides:');
console.log('   - DEPLOY_RENDER.md (recommended for beginners)');
console.log('   - DEPLOY_RAILWAY.md (fastest deployment)');
console.log('   - FREE_DEPLOYMENT_GUIDE.md (all options)\n');
