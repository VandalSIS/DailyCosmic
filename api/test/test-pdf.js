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
    
    console.log('Testing PDF URL:', ariesPdfUrl);
    
    // Test PDF fetch with headers
    const pdfResponse = await fetch(ariesPdfUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Vercel-Function)',
        'Accept': 'application/pdf,*/*'
      }
    });
    
    console.log('PDF Response Status:', pdfResponse.status);
    console.log('PDF Response Status Text:', pdfResponse.statusText);
    console.log('PDF Response Headers:', Object.fromEntries(pdfResponse.headers));
    
    if (!pdfResponse.ok) {
      const errorBody = await pdfResponse.text();
      console.log('Error response body:', errorBody);
      
      return res.status(200).json({
        success: false,
        message: 'PDF URL test failed',
        pdfUrl: ariesPdfUrl,
        status: pdfResponse.status,
        statusText: pdfResponse.statusText,
        headers: Object.fromEntries(pdfResponse.headers),
        errorBody: errorBody
      });
    }
    
    // Try to get content info without downloading full PDF
    const contentLength = pdfResponse.headers.get('content-length');
    const contentType = pdfResponse.headers.get('content-type');
    
    // Test if we can read the first few bytes
    const reader = pdfResponse.body.getReader();
    const { value, done } = await reader.read();
    reader.releaseLock();
    
    return res.status(200).json({
      success: true,
      message: 'PDF URL is accessible',
      pdfUrl: ariesPdfUrl,
      status: pdfResponse.status,
      statusText: pdfResponse.statusText,
      contentLength: contentLength,
      contentType: contentType,
      firstBytesLength: value ? value.length : 0,
      headers: Object.fromEntries(pdfResponse.headers)
    });
    
  } catch (error) {
    console.error('PDF test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    });
  }
} 