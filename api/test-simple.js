export default async function handler(req, res) {
  try {
    // Basic test without any imports
    console.log('Simple test function called');
    console.log('Environment check:', {
      hasApiKey: !!process.env.RESEND_API_KEY,
      apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
      nodeVersion: process.version
    });

    return res.status(200).json({
      success: true,
      message: 'Simple test working',
      environment: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
        nodeVersion: process.version
      }
    });

  } catch (error) {
    console.error('Simple test error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 