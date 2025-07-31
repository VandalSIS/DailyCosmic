import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if API key is available
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'RESEND_API_KEY not found in environment variables',
        message: 'Please check your Vercel environment variables'
      });
    }

    // Test Resend initialization
    const resend = new Resend(apiKey || 're_U1nNGLbj_52HAdxiowuiKQCNFKQGzXACF');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Resend is properly configured',
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 3) + '...'
    });

  } catch (error) {
    console.error('Resend test error:', error);
    return res.status(500).json({ 
      error: 'Failed to initialize Resend',
      details: error.message 
    });
  }
} 