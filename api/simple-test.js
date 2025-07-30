export default async function handler(req, res) {
  try {
    console.log('Simple test called with method:', req.method);
    console.log('Body:', req.body);
    
    if (req.method === 'GET') {
      return res.status(200).json({ 
        message: 'API is working!', 
        timestamp: new Date().toISOString() 
      });
    }
    
    if (req.method === 'POST') {
      const { email } = req.body || {};
      
      // Import Resend
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      console.log('Sending test email to:', email || 'mihail.mihai2001@gmail.com');
      console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
      
      // Send simple email without PDF
      const emailData = await resend.emails.send({
        from: 'noreply@cadalunastro.com',
        to: email || 'mihail.mihai2001@gmail.com',
        subject: '🧪 SIMPLE TEST - API WORKS!',
        html: `
          <h1>SUCCESS! 🎉</h1>
          <p>Your email system is working!</p>
          <p>Time: ${new Date().toISOString()}</p>
        `
      });

      console.log('Email sent successfully:', emailData);
      return res.status(200).json({ 
        success: true, 
        message: 'Email sent!',
        emailData 
      });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}