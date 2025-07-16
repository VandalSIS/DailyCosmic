#!/usr/bin/env node

/**
 * PayPal Environment Setup Script
 * Creates .env.local file with PayPal Sandbox credentials
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PayPal Sandbox credentials
const PAYPAL_CLIENT_ID = 'ASmSlhvv_5Rie80Qt0OBSXIp8LJ6NoCSM4-FLh9_nJQ0_qz7zBKMUPWJEuXUXi6JykvUoega7YG0loyf';
const PAYPAL_CLIENT_SECRET = 'EHZGyi3kCf0h3rclVWCWqpHemMjgNmZvWItjtgR6A7kgF78Xq3-9oc26lUetOhR9EhBI4B4uspVbaaoB';

const envContent = `# PayPal Sandbox Configuration for Testing
PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
PAYPAL_CLIENT_SECRET=${PAYPAL_CLIENT_SECRET}

# PayPal Environment (sandbox for testing, production for live)
PAYPAL_ENVIRONMENT=sandbox

# Vercel Blob Storage (already configured)
BLOB_READ_WRITE_TOKEN=vercel_bel_xxxxxxx

# Email Service (for horoscope delivery)
RESEND_API_KEY=re_xxxxxxx

# Application URL
VITE_APP_URL=http://localhost:5173

# Environment
NODE_ENV=development

# Optional: Add your email service API key here
# RESEND_API_KEY=your_resend_key_here
`;

const envFilePath = path.join(path.dirname(__dirname), '.env.local');

console.log('🔧 Setting up PayPal environment configuration...');
console.log('');

// Check if .env.local already exists
if (fs.existsSync(envFilePath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('');
  console.log('Please backup your existing .env.local file if needed, then run:');
  console.log('   rm .env.local');
  console.log('   node scripts/setup-paypal-env.js');
  process.exit(0);
}

try {
  // Write the environment file
  fs.writeFileSync(envFilePath, envContent);
  
  console.log('✅ Successfully created .env.local with PayPal Sandbox credentials!');
  console.log('');
  console.log('📋 Configuration:');
  console.log('   ✅ PayPal Client ID: ' + PAYPAL_CLIENT_ID.substring(0, 20) + '...');
  console.log('   ✅ PayPal Client Secret: ' + PAYPAL_CLIENT_SECRET.substring(0, 20) + '...');
  console.log('   ✅ Environment: Sandbox (testing mode)');
  console.log('   ✅ API URL: https://api.sandbox.paypal.com');
  console.log('');
  console.log('🧪 Next Steps:');
  console.log('   1. Start the development server: npm run dev');
  console.log('   2. Test PayPal integration: http://localhost:5173/api/test-paypal-sandbox');
  console.log('   3. Test full subscription flow on your app');
  console.log('');
  console.log('🎯 Ready to test PayPal Sandbox subscriptions!');
  
} catch (error) {
  console.error('❌ Failed to create .env.local file:', error.message);
  process.exit(1);
} 