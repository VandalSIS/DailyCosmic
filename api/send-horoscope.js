import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, zodiacSign } = req.body;

    if (!name || !email || !zodiacSign) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailData = await resend.emails.send({
      from: 'noreply@cadalunastro.com',
      to: email,
      subject: `🌟 Your ${zodiacSign} Horoscope from Cosmic Calendar`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">🌟 Your ${zodiacSign} Horoscope! 🌟</h1>
          
          <p>Dear ${name},</p>
          
          <p><strong>SUCCESS!</strong> Your personalized horoscope is ready!</p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2>✨ Your ${zodiacSign} Insights:</h2>
            <p>This month brings new opportunities for ${zodiacSign}. Your cosmic energy is aligned for success in both personal and professional endeavors.</p>
            <p><strong>Lucky Days:</strong> 15th, 22nd, 28th</p>
            <p><strong>Lucky Colors:</strong> Blue, Silver, Purple</p>
            <p><strong>Focus Areas:</strong> Career growth, relationships, health</p>
          </div>
          
          <p><strong>Next delivery:</strong> 15th of each month</p>
          
          <p>Thank you for subscribing!</p>
          <p>Best regards,<br>The Cosmic Calendar Team</p>
        </div>
      `
    });

    console.log('Email sent successfully:', emailData);
    return res.status(200).json({ success: true, data: emailData });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}