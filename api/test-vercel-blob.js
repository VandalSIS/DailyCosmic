export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const ariesPdfUrl = 'https://jf7h0yktfn8fx1fma.public.blob.vercel-storage.com/aries-calendar-TvKkvqf5gU4sV50Ze7zpMoZhHzmBHa.pdf';
    
    console.log('Testing Vercel Blob download...');
    console.log('PDF URL:', ariesPdfUrl);
    console.log('Has token:', !!process.env.BLOB_READ_WRITE_TOKEN);
    console.log('Token length:', process.env.BLOB_READ_WRITE_TOKEN?.length || 0);
    
    // Test Vercel Blob download
    try {
      const { download } = await import('@vercel/blob');
      
      console.log('Vercel Blob imported successfully');
      
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('BLOB_READ_WRITE_TOKEN not found');
      }
      
      console.log('Attempting download...');
      
      const downloadResponse = await download(ariesPdfUrl, {
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
      
      console.log('Download response received');
      console.log('Response type:', typeof downloadResponse);
      console.log('Response keys:', Object.keys(downloadResponse));
      
      // Try to get the content
      const pdfBuffer = await downloadResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
      
      return res.status(200).json({
        success: true,
        message: 'Vercel Blob download successful',
        pdfUrl: ariesPdfUrl,
        pdfSize: pdfBuffer.byteLength,
        base64Size: pdfBase64.length,
        downloadResponse: {
          type: typeof downloadResponse,
          keys: Object.keys(downloadResponse)
        }
      });
      
    } catch (blobError) {
      console.error('Vercel Blob download error:', blobError);
      
      return res.status(200).json({
        success: false,
        message: 'Vercel Blob download failed',
        error: blobError.message,
        stack: blobError.stack,
        pdfUrl: ariesPdfUrl,
        hasToken: !!process.env.BLOB_READ_WRITE_TOKEN
      });
    }
    
  } catch (error) {
    console.error('Test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    });
  }
} 