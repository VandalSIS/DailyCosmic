#!/usr/bin/env node

/**
 * PDF Upload to Vercel Blob Script
 * 
 * This script uploads PDF files to Vercel Blob storage and updates the zodiac mapping.
 * 
 * Usage:
 * 1. Make sure you have BLOB_READ_WRITE_TOKEN in your environment
 * 2. Place your PDF files in the 'pdfs/' directory
 * 3. Run: node scripts/pdf-upload-to-blob.js
 * 
 * Requirements:
 * - PDF files must be named exactly: aries-calendar.pdf, taurus-calendar.pdf, etc.
 * - Files must be in the 'pdfs/' directory
 * - BLOB_READ_WRITE_TOKEN environment variable must be set
 */

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');
require('dotenv').config();

// Zodiac signs mapping
const zodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function uploadPdfsToBlob() {
  try {
    log('🚀 Starting PDF upload to Vercel Blob...', 'cyan');
    
    // Check if BLOB_READ_WRITE_TOKEN exists
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      log('❌ Error: BLOB_READ_WRITE_TOKEN environment variable not found!', 'red');
      log('Please set up your Vercel Blob storage and pull environment variables:', 'yellow');
      log('  vercel env pull', 'yellow');
      process.exit(1);
    }
    
    // Check if pdfs directory exists
    const pdfsDir = path.join(process.cwd(), 'pdfs');
    if (!fs.existsSync(pdfsDir)) {
      log('❌ Error: pdfs/ directory not found!', 'red');
      log('Please create a pdfs/ directory and add your PDF files:', 'yellow');
      log('  mkdir pdfs', 'yellow');
      process.exit(1);
    }
    
    const uploadResults = {};
    const uploadPromises = [];
    
    // Process each zodiac sign
    for (const sign of zodiacSigns) {
      const filename = `${sign}-calendar.pdf`;
      const filePath = path.join(pdfsDir, filename);
      
      if (fs.existsSync(filePath)) {
        log(`📄 Found ${filename}`, 'blue');
        
        // Create upload promise
        const uploadPromise = (async () => {
          try {
            const fileBuffer = fs.readFileSync(filePath);
            const blobPath = `zodiac-calendars/${filename}`;
            
            log(`⬆️  Uploading ${filename} to Vercel Blob...`, 'yellow');
            
            const blob = await put(blobPath, fileBuffer, {
              access: 'public',
              contentType: 'application/pdf'
            });
            
            uploadResults[sign] = {
              success: true,
              url: blob.url,
              filename: filename
            };
            
            log(`✅ Successfully uploaded ${filename}`, 'green');
            log(`   URL: ${blob.url}`, 'green');
            
          } catch (error) {
            uploadResults[sign] = {
              success: false,
              error: error.message,
              filename: filename
            };
            log(`❌ Failed to upload ${filename}: ${error.message}`, 'red');
          }
        })();
        
        uploadPromises.push(uploadPromise);
      } else {
        log(`⚠️  Missing ${filename}`, 'yellow');
        uploadResults[sign] = {
          success: false,
          error: 'File not found',
          filename: filename
        };
      }
    }
    
    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
    
    // Generate updated mapping file
    log('\n📝 Generating updated zodiac mapping...', 'cyan');
    
    const mappingContent = generateMappingFile(uploadResults);
    const mappingPath = path.join(process.cwd(), 'src/lib/zodiacPdfMapping.ts');
    
    fs.writeFileSync(mappingPath, mappingContent);
    log('✅ Updated zodiacPdfMapping.ts with Blob URLs', 'green');
    
    // Summary
    log('\n📊 Upload Summary:', 'cyan');
    const successful = Object.values(uploadResults).filter(r => r.success).length;
    const failed = Object.values(uploadResults).filter(r => !r.success).length;
    
    log(`✅ Successful uploads: ${successful}`, 'green');
    log(`❌ Failed uploads: ${failed}`, failed > 0 ? 'red' : 'green');
    
    if (failed > 0) {
      log('\n❌ Failed uploads:', 'red');
      Object.entries(uploadResults).forEach(([sign, result]) => {
        if (!result.success) {
          log(`  - ${result.filename}: ${result.error}`, 'red');
        }
      });
    }
    
    if (successful === zodiacSigns.length) {
      log('\n🎉 All PDFs uploaded successfully!', 'green');
      log('Your zodiac calendar system is now ready to use with Vercel Blob storage.', 'green');
    } else {
      log('\n⚠️  Some uploads failed. Please check the errors above and retry.', 'yellow');
    }
    
  } catch (error) {
    log(`❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
}

function generateMappingFile(uploadResults) {
  const mappingEntries = zodiacSigns.map(sign => {
    const result = uploadResults[sign];
    const blobUrl = result && result.success ? `'${result.url}'` : 'undefined';
    
    return `  ${sign}: {
    filename: '${sign}-calendar.pdf',
    displayName: '${sign.charAt(0).toUpperCase() + sign.slice(1)} Daily Planner',
    blobUrl: ${blobUrl}
  }`;
  }).join(',\n');
  
  return `export interface ZodiacPdfMapping {
  filename: string;
  displayName: string;
  blobUrl?: string; // Vercel Blob URL - will be populated after upload
}

export const zodiacPdfMapping: Record<string, ZodiacPdfMapping> = {
${mappingEntries}
};

// Helper function to get PDF URL (Blob URL or fallback)
export function getPdfUrl(zodiacSign: string): string | null {
  const mapping = zodiacPdfMapping[zodiacSign.toLowerCase()];
  if (!mapping) return null;
  
  // Use Blob URL if available, otherwise return null
  return mapping.blobUrl || null;
}

// Helper function to check if all PDFs are uploaded to Blob
export function areAllPdfsUploaded(): boolean {
  return Object.values(zodiacPdfMapping).every(mapping => mapping.blobUrl);
}

// Helper function to get missing PDFs
export function getMissingPdfs(): string[] {
  return Object.entries(zodiacPdfMapping)
    .filter(([_, mapping]) => !mapping.blobUrl)
    .map(([sign, _]) => sign);
}`;
}

// Run the script
if (require.main === module) {
  uploadPdfsToBlob().catch(error => {
    log(`❌ Script failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { uploadPdfsToBlob }; 