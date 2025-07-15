const fs = require('fs');
const path = require('path');

// Required PDF filenames
const requiredPdfs = [
  'aries-calendar.pdf',
  'taurus-calendar.pdf',
  'gemini-calendar.pdf',
  'cancer-calendar.pdf',
  'leo-calendar.pdf',
  'virgo-calendar.pdf',
  'libra-calendar.pdf',
  'scorpio-calendar.pdf',
  'sagittarius-calendar.pdf',
  'capricorn-calendar.pdf',
  'aquarius-calendar.pdf',
  'pisces-calendar.pdf'
];

const pdfDir = path.join(__dirname, '../public/pdfs');

// Check which PDFs are missing
function checkMissingPdfs() {
  console.log('🔍 Checking for PDF files...\n');
  
  const missingFiles = [];
  const existingFiles = [];
  
  requiredPdfs.forEach(filename => {
    const filePath = path.join(pdfDir, filename);
    if (fs.existsSync(filePath)) {
      existingFiles.push(filename);
      console.log(`✅ ${filename} - Found`);
    } else {
      missingFiles.push(filename);
      console.log(`❌ ${filename} - Missing`);
    }
  });
  
  console.log(`\n📊 Summary: ${existingFiles.length}/${requiredPdfs.length} files found`);
  
  if (missingFiles.length > 0) {
    console.log('\n🚨 Missing files:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
  } else {
    console.log('\n🎉 All PDF files are ready!');
  }
  
  return { existingFiles, missingFiles };
}

// Create template files for testing
function createTestPdfs() {
  console.log('🧪 Creating test PDF placeholders...\n');
  
  const testContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Test PDF) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF`;

  requiredPdfs.forEach(filename => {
    const filePath = path.join(pdfDir, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, testContent);
      console.log(`✅ Created test file: ${filename}`);
    } else {
      console.log(`⏭️  Skipped (exists): ${filename}`);
    }
  });
  
  console.log('\n🎉 Test PDF files created!');
  console.log('📝 Note: Replace these with your actual zodiac PDFs');
}

// Main function
function main() {
  const command = process.argv[2];
  
  console.log('🌟 Cosmic Daily Planner - PDF Helper\n');
  
  // Ensure pdfs directory exists
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
    console.log('📁 Created pdfs directory\n');
  }
  
  switch (command) {
    case 'check':
      checkMissingPdfs();
      break;
    case 'test':
      createTestPdfs();
      break;
    default:
      console.log('Usage:');
      console.log('  node scripts/pdf-helper.js check  - Check which PDFs are missing');
      console.log('  node scripts/pdf-helper.js test   - Create test PDF files');
      console.log('\nAfter running "test", replace the test files with your actual zodiac PDFs');
  }
}

main(); 