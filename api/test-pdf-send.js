export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, zodiacSign } = req.body;

    console.log('Test PDF send called with:', { name, email, zodiacSign });

    // Check environment variables
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('BLOB_READ_WRITE_TOKEN exists:', !!process.env.BLOB_READ_WRITE_TOKEN);

    // Simple response for now
    return res.status(200).json({
      success: true,
      message: 'Test API called successfully',
      data: { name, email, zodiacSign },
      envCheck: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN
      }
    });

  } catch (error) {
    console.error('Test API Error:', error);
    return res.status(500).json({ error: 'Test API failed', details: error.message });
  }
} 