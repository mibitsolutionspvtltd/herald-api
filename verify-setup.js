#!/usr/bin/env node

/**
 * Setup Verification Script
 * Verifies that the application is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Student Herald API - Setup Verification\n');
console.log('='.repeat(60));

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

// Check 1: Required files exist
console.log('\n📁 Checking required files...');
const requiredFiles = [
  'package.json',
  'server.js',
  '.env.example',
  '.gitignore',
  'README.md'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checks.passed.push(`${file} exists`);
  } else {
    checks.failed.push(`${file} is missing`);
  }
});

// Check 2: Required directories exist
console.log('\n📂 Checking required directories...');
const requiredDirs = [
  'config',
  'controllers',
  'models',
  'routes',
  'middleware',
  'migrations'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    checks.passed.push(`${dir}/ directory exists`);
  } else {
    checks.failed.push(`${dir}/ directory is missing`);
  }
});

// Check 3: .env file
console.log('\n🔐 Checking environment configuration...');
if (fs.existsSync('.env')) {
  checks.warnings.push('.env file exists (should not be committed to git)');
} else {
  checks.passed.push('.env file not present (good for git)');
}

if (fs.existsSync('.env.example')) {
  checks.passed.push('.env.example exists');
  
  // Check if .env.example has placeholder values
  const envExample = fs.readFileSync('.env.example', 'utf8');
  if (envExample.includes('your-') || envExample.includes('localhost')) {
    checks.passed.push('.env.example has placeholder values');
  } else {
    checks.warnings.push('.env.example may contain real credentials');
  }
}

// Check 4: package.json validation
console.log('\n📦 Checking package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (pkg.name) checks.passed.push('Package name defined');
  if (pkg.version) checks.passed.push('Package version defined');
  if (pkg.main) checks.passed.push('Main entry point defined');
  if (pkg.scripts && pkg.scripts.start) checks.passed.push('Start script defined');
  if (pkg.dependencies) checks.passed.push('Dependencies defined');
  
  // Check for required dependencies
  const requiredDeps = ['express', 'sequelize', 'mysql2', 'dotenv'];
  const missingDeps = requiredDeps.filter(dep => !pkg.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    checks.passed.push('All required dependencies present');
  } else {
    checks.failed.push(`Missing dependencies: ${missingDeps.join(', ')}`);
  }
} catch (error) {
  checks.failed.push('package.json is invalid JSON');
}

// Check 5: Migration files
console.log('\n🗄️  Checking database migrations...');
if (fs.existsSync('migrations')) {
  const migrations = fs.readdirSync('migrations').filter(f => f.endsWith('.sql'));
  if (migrations.length > 0) {
    checks.passed.push(`${migrations.length} migration file(s) found`);
    
    // Check for the main migration
    if (migrations.includes('COMPLETE_DATABASE_SCHEMA.sql')) {
      checks.passed.push('Main migration file (COMPLETE_DATABASE_SCHEMA.sql) found');
    } else {
      checks.warnings.push('COMPLETE_DATABASE_SCHEMA.sql not found');
    }
  } else {
    checks.warnings.push('No SQL migration files found');
  }
}

// Check 6: .gitignore
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
}

// Check 7: Git repository
console.log('\n🔧 Checking git configuration...');
if (fs.existsSync('.git')) {
  checks.passed.push('Git repository initialized');
  
  // Check git remote
  try {
    const { execSync } = require('child_process');
    const remote = execSync('git remote -v', { encoding: 'utf8' });
    if (remote.includes('github.com')) {
      checks.passed.push('GitHub remote configured');
    } else {
      checks.warnings.push('No GitHub remote found');
    }
  } catch (error) {
    checks.warnings.push('Could not check git remote');
  }
} else {
  checks.failed.push('Git repository not initialized');
}

// Check 8: Documentation
console.log('\n📚 Checking documentation...');
const docFiles = [
  'README.md',
  'START_HERE.md',
  'TEST_CREDENTIALS.md',
  'DEPLOY_RENDER.md'
];

docFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checks.passed.push(`${file} exists`);
  }
});

// Check 9: Logs directory
console.log('\n📊 Checking logs directory...');
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs', { recursive: true });
  checks.passed.push('Created logs directory');
} else {
  checks.passed.push('Logs directory exists');
}

// Print Results
console.log('\n' + '='.repeat(60));
console.log('\n📊 VERIFICATION RESULTS:\n');

if (checks.passed.length > 0) {
  console.log('✅ PASSED (' + checks.passed.length + '):');
  checks.passed.forEach(check => console.log(`   ✓ ${check}`));
}

if (checks.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS (' + checks.warnings.length + '):');
  checks.warnings.forEach(check => console.log(`   ! ${check}`));
}

if (checks.failed.length > 0) {
  console.log('\n❌ FAILED (' + checks.failed.length + '):');
  checks.failed.forEach(check => console.log(`   ✗ ${check}`));
}

// Final verdict
console.log('\n' + '='.repeat(60));
if (checks.failed.length === 0) {
  console.log('\n✅ Setup verification PASSED!');
  console.log('\nYour application is properly configured and ready to:');
  console.log('  1. Push to GitHub');
  console.log('  2. Deploy to hosting platform');
  console.log('  3. Run locally with npm start\n');
  process.exit(0);
} else {
  console.log('\n❌ Setup verification FAILED!');
  console.log('\nPlease fix the failed checks before proceeding.\n');
  process.exit(1);
}
