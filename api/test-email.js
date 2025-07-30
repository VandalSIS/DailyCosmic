export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🧪 Testing email sending...');
    
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { email } = req.body;
    const testEmail = email || 'mihail.mihai2001@gmail.com';
    
    console.log('Sending test email to:', testEmail);
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    
    const emailData = await resend.emails.send({
      from: 'noreply@cadalunastro.com',
      to: testEmail,
      subject: '🧪 Test Email from Webhook System',
      html: `
        <h1>Test Email Success! 🎉</h1>
        <p>This confirms your email system is working.</p>
        <p>Sent to: ${testEmail}</p>
        <p>Time: ${new Date().toISOString()}</p>
      `
    });

    console.log('✅ Test email sent successfully:', emailData);
    return res.status(200).json({ 
      success: true, 
      message: 'Test email sent',
      emailData 
    });

  } catch (error) {
    console.error('❌ Test email failed:', error);
    return res.status(500).json({ 
      error: 'Test email failed', 
      details: error.message 
    });
  }
}