export default async function handler(req, res) {
  console.log('📧 Email API called');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, zodiacSign } = req.body;
    
    console.log('Sending email to:', email);
    
    // Import Resend
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send simple email first
    const emailData = await resend.emails.send({
      from: 'noreply@cadalunastro.com',
      to: email,
      subject: '🎉 Your Cosmic Calendar - Test Email',
      html: `
        <h1>Hello ${name}!</h1>
        <p>This is a test email for your ${zodiacSign} horoscope.</p>
        <p>If you receive this, the email system is working!</p>
        <p>PDF feature coming next...</p>
      `
    });

    console.log('✅ Email sent:', emailData);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully!',
      id: emailData.id 
    });
    
  } catch (error) {
    console.error('❌ Email error:', error);
    return res.status(500).json({ 
      error: error.message 
    });
  }
}