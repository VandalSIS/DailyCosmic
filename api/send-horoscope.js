import { Resend } from 'resend';

const resend = new Resend('re_U1nNGLbj_52HAdxiowuiKQCNFKQGzXACF');

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
      from: 'onboarding@resend.dev',
      to: email,
      subject: `🌟 Your ${zodiacSign} Horoscope - Personal Reading`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">🌟 Your Personal ${zodiacSign} Reading 🌟</h1>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for your purchase! Here is your personalized horoscope reading.</p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2>✨ Your ${zodiacSign} Insights:</h2>
            <p>The stars have aligned to reveal your path forward. This reading is specifically crafted for you.</p>
            
            <h3>🌠 Key Areas of Focus:</h3>
            <ul style="list-style: none; padding: 0;">
              <li>💫 <strong>Career:</strong> Major opportunities ahead! Your professional life takes an exciting turn.</li>
              <li>❤️ <strong>Love:</strong> Deep connections form. Express your feelings openly.</li>
              <li>🧘‍♀️ <strong>Health:</strong> Focus on rest and rejuvenation. Try meditation.</li>
              <li>💰 <strong>Money:</strong> Financial prospects improve. Smart investments pay off.</li>
            </ul>

            <div style="margin-top: 20px;">
              <p><strong>🎯 Lucky Days:</strong> 15th, 22nd, 28th</p>
              <p><strong>🎨 Power Colors:</strong> Blue, Silver, Purple</p>
              <p><strong>💎 Crystal Guide:</strong> Amethyst - For clarity and peace</p>
            </div>
          </div>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #4b5563;">🌙 Monthly Affirmation</h3>
            <p style="font-style: italic;">"I am aligned with the cosmic energy. Success and happiness flow naturally to me."</p>
          </div>

          <p style="margin-top: 20px;">May the stars light your path!</p>
          <p>Best wishes,<br>The Cosmic Calendar Team</p>
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