export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Testing email with simple PDF attachment');
    
    const testEmail = req.query?.email || req.body?.email || 'test@example.com';
    
    // Use a simple public PDF for testing
    const testPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    
    console.log('Fetching test PDF from:', testPdfUrl);
    
    // Fetch the test PDF
    const pdfResponse = await fetch(testPdfUrl);
    
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch test PDF: ${pdfResponse.status}`);
    }
    
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
    
    console.log('Test PDF fetched, size:', pdfBase64.length);
    
    // Import Resend
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send test email with PDF attachment
    const { data, error } = await resend.emails.send({
      from: 'Cosmic Daily Planner <onboarding@resend.dev>',
      to: [testEmail],
      subject: '🧪 PDF Attachment Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>PDF Attachment Test</h1>
          <p>This is a test email to verify PDF attachments work.</p>
          <p>If you receive this email with a PDF attached, the system is working!</p>
          <p>Sent to: ${testEmail}</p>
          <p>Time: ${new Date().toISOString()}</p>
        </div>
      `,
      attachments: [
        {
          filename: 'test-document.pdf',
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    });

    if (error) {
      console.error('Email send error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send email: ' + error.message
      });
    }

    console.log('Test email sent successfully:', data);
    return res.status(200).json({
      success: true,
      message: 'Test email with PDF attachment sent successfully',
      sentTo: testEmail,
      pdfSize: pdfBase64.length,
      emailData: data
    });

  } catch (error) {
    console.error('Test error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
} 