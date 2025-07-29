export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const ariesPdfUrl = 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/aries-calendar-TvKkvqf5gU4sV50Ze7zpMoZhHzmBHa.pdf';
    
    const results = {};
    
    // Test 1: Basic fetch
    console.log('Test 1: Basic fetch');
    try {
      const response1 = await fetch(ariesPdfUrl);
      results.basicFetch = {
        status: response1.status,
        statusText: response1.statusText,
        headers: Object.fromEntries(response1.headers),
        contentType: response1.headers.get('content-type')
      };
    } catch (error) {
      results.basicFetch = { error: error.message };
    }
    
    // Test 2: Fetch with Accept header
    console.log('Test 2: Fetch with Accept header');
    try {
      const response2 = await fetch(ariesPdfUrl, {
        headers: {
          'Accept': 'application/pdf,*/*'
        }
      });
      results.fetchWithAccept = {
        status: response2.status,
        statusText: response2.statusText,
        headers: Object.fromEntries(response2.headers),
        contentType: response2.headers.get('content-type')
      };
    } catch (error) {
      results.fetchWithAccept = { error: error.message };
    }
    
    // Test 3: Fetch with Authorization (if token exists)
    console.log('Test 3: Fetch with Authorization');
    try {
      const headers = {
        'Accept': 'application/pdf,*/*',
        'User-Agent': 'Mozilla/5.0 (compatible; Vercel-Function)'
      };
      
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`;
      }
      
      const response3 = await fetch(ariesPdfUrl, { headers });
      results.fetchWithAuth = {
        status: response3.status,
        statusText: response3.statusText,
        headers: Object.fromEntries(response3.headers),
        contentType: response3.headers.get('content-type'),
        hasToken: !!process.env.BLOB_READ_WRITE_TOKEN
      };
    } catch (error) {
      results.fetchWithAuth = { error: error.message };
    }
    
    // Test 4: Try Vercel Blob API
    console.log('Test 4: Vercel Blob API');
    try {
      const { head } = await import('@vercel/blob');
      
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blobInfo = await head(ariesPdfUrl, {
          token: process.env.BLOB_READ_WRITE_TOKEN
        });
        results.vercelBlobAPI = {
          success: true,
          blobInfo: blobInfo
        };
      } else {
        results.vercelBlobAPI = {
          error: 'No BLOB_READ_WRITE_TOKEN found'
        };
      }
    } catch (error) {
      results.vercelBlobAPI = { error: error.message };
    }
    
    return res.status(200).json({
      success: true,
      message: 'Blob authentication tests completed',
      pdfUrl: ariesPdfUrl,
      results: results,
      environment: {
        hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length || 0
      }
    });
    
  } catch (error) {
    console.error('Blob auth test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    });
  }
} 