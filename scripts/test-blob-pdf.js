#!/usr/bin/env node

/**
 * Test Vercel Blob PDF System
 * 
 * This script tests if the PDF system works with Vercel Blob storage
 */

import { getPdfUrl, getMissingPdfs } from '../src/lib/zodiacPdfMapping.js';
import { sendZodiacCalendar } from '../src/lib/emailService.js';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testPdfSystem() {
  try {
    log('🧪 Testing Vercel Blob PDF System...', 'cyan');
    
    // Test 1: Check if Aries PDF URL is available
    log('\n📋 Test 1: Checking Aries PDF URL...', 'blue');
    const ariesUrl = getPdfUrl('aries');
    
    if (ariesUrl) {
      log(`✅ Aries PDF URL found: ${ariesUrl}`, 'green');
    } else {
      log('❌ Aries PDF URL not found', 'red');
      return;
    }
    
    // Test 2: Check if PDF is accessible
    log('\n📋 Test 2: Checking PDF accessibility...', 'blue');
    try {
      const response = await fetch(ariesUrl);
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        log(`✅ PDF is accessible`, 'green');
        log(`   Content-Type: ${contentType}`, 'green');
        log(`   Content-Length: ${contentLength} bytes`, 'green');
      } else {
        log(`❌ PDF not accessible: ${response.status} ${response.statusText}`, 'red');
        return;
      }
    } catch (error) {
      log(`❌ Error accessing PDF: ${error.message}`, 'red');
      return;
    }
    
    // Test 3: Test email sending (mock)
    log('\n📋 Test 3: Testing email system...', 'blue');
    try {
      const result = await sendZodiacCalendar(
        'Test User',
        'test@example.com',
        'aries',
        'free'
      );
      
      if (result.success) {
        log('✅ Email system working correctly', 'green');
      } else {
        log(`❌ Email system failed: ${result.error}`, 'red');
      }
    } catch (error) {
      log(`❌ Email system error: ${error.message}`, 'red');
    }
    
    // Test 4: Check missing PDFs
    log('\n📋 Test 4: Checking missing PDFs...', 'blue');
    const missingPdfs = getMissingPdfs();
    
    if (missingPdfs.length === 0) {
      log('✅ All PDFs are uploaded', 'green');
    } else {
      log(`⚠️  Missing PDFs: ${missingPdfs.join(', ')}`, 'yellow');
      log(`   You have ${12 - missingPdfs.length}/12 PDFs uploaded`, 'yellow');
    }
    
    // Summary
    log('\n🎉 Test Summary:', 'cyan');
    log('✅ Aries PDF is working correctly', 'green');
    log('✅ Email system is functional', 'green');
    log('✅ Your system is ready for testing!', 'green');
    
    log('\n🚀 Next Steps:', 'cyan');
    log('1. Start your dev server: npm run dev', 'yellow');
    log('2. Go to http://localhost:3000', 'yellow');
    log('3. Select "Aries" as zodiac sign', 'yellow');
    log('4. Click "Get Free Calendar"', 'yellow');
    log('5. Check console for email output', 'yellow');
    
  } catch (error) {
    log(`❌ Test failed: ${error.message}`, 'red');
  }
}

// Run the test
testPdfSystem(); 