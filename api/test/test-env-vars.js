export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Debug environment variables
    const envDebug = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL,
      
      // PayPal env vars (show if they exist, but mask the values)
      paypalClientId: process.env.PAYPAL_CLIENT_ID ? {
        exists: true,
        length: process.env.PAYPAL_CLIENT_ID.length,
        firstChars: process.env.PAYPAL_CLIENT_ID.substring(0, 10) + '...',
        lastChars: '...' + process.env.PAYPAL_CLIENT_ID.slice(-10)
      } : { exists: false },
      
      paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET ? {
        exists: true,
        length: process.env.PAYPAL_CLIENT_SECRET.length,
        firstChars: process.env.PAYPAL_CLIENT_SECRET.substring(0, 10) + '...',
        lastChars: '...' + process.env.PAYPAL_CLIENT_SECRET.slice(-10)
      } : { exists: false },
      
      paypalEnvironment: process.env.PAYPAL_ENVIRONMENT || 'not set',
      
      // All environment variable keys (for debugging)
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.includes('PAYPAL') || 
        key.includes('VERCEL') || 
        key.includes('NODE') ||
        key.includes('BLOB')
      ),
      
      totalEnvVars: Object.keys(process.env).length
    };

    return res.status(200).json({
      success: true,
      message: 'Environment variables debug info',
      debug: envDebug,
      issue: !process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET 
        ? 'PayPal credentials are missing from environment'
        : 'PayPal credentials are available',
      
      recommendation: !process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET
        ? [
            '1. Go to Vercel Dashboard → Settings → Environment Variables',
            '2. Make sure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are set',
            '3. Ensure "Production" environment is checked',
            '4. Redeploy the application',
            '5. Wait for deployment to complete before testing'
          ]
        : [
            '1. PayPal credentials are available',
            '2. Check PayPal service implementation',
            '3. Verify API calls are working'
          ]
    });

  } catch (error) {
    console.error('Environment debug error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    });
  }
} 