export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Test email API called');
    console.log('Method:', req.method);
    console.log('Body:', req.body);
    
    // Check environment
    const hasApiKey = !!process.env.RESEND_API_KEY;
    const apiKeyLength = process.env.RESEND_API_KEY?.length || 0;
    
    console.log('Environment check:', { hasApiKey, apiKeyLength });
    
    if (!hasApiKey) {
      return res.status(500).json({
        success: false,
        error: 'RESEND_API_KEY not found in environment variables'
      });
    }

    // Try to import Resend
    let Resend;
    try {
      const resendModule = await import('resend');
      Resend = resendModule.Resend;
      console.log('Resend imported successfully');
    } catch (importError) {
      console.error('Failed to import Resend:', importError);
      return res.status(500).json({
        success: false,
        error: 'Failed to import Resend: ' + importError.message
      });
    }

    // Test simple email without attachment
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Get email from request body or query params
    const testEmail = req.body?.email || req.query?.email;
    
    if (!testEmail) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email address in the request body or query parameter'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format provided'
      });
    }

    // Check for test/example domains that Resend might reject
    const testDomains = ['example.com', 'test.com', 'testing.com', 'fake.com'];
    const emailDomain = testEmail.split('@')[1]?.toLowerCase();
    
    if (testDomains.includes(emailDomain)) {
      return res.status(400).json({
        success: false,
        error: 'Please use a real email address. Resend does not allow test domains like example.com'
      });
    }
    
    console.log('Attempting to send test email to:', testEmail);
    
    const { data, error } = await resend.emails.send({
      from: 'Cosmic Daily Planner <noreply@cadalunastro.com>',
      to: [testEmail],
      subject: '🧪 Test Email from Cosmic Daily Planner',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0;">
          <h1 style="color: #333;">Test Email Success! 🎉</h1>
          <p>This is a test email from your Cosmic Daily Planner API.</p>
          <p>If you received this, your email system is working correctly!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
          <p>Your email: ${testEmail}</p>
          <p><strong>Success!</strong> This email is now sent from your verified custom domain: cadalunastro.com</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({
        success: false,
        error: 'Resend error: ' + error.message,
        details: error
      });
    }

    console.log('Test email sent successfully:', data);
    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      sentTo: testEmail,
      data: data,
      environment: {
        hasApiKey,
        apiKeyLength,
        nodeVersion: process.version
      }
    });

  } catch (error) {
    console.error('Test email error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    });
  }
} 