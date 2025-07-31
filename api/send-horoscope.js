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
          
          <p>Thank you for your purchase! Your personalized horoscope reading is attached to this email.</p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2>✨ What You'll Find in Your PDF:</h2>
            <ul style="list-style: none; padding: 0;">
              <li>💫 <strong>Career Insights:</strong> Major opportunities ahead!</li>
              <li>❤️ <strong>Love Guidance:</strong> Deep connections form</li>
              <li>🧘‍♀️ <strong>Health Tips:</strong> Focus on rest and rejuvenation</li>
              <li>💰 <strong>Money Forecast:</strong> Financial prospects improve</li>
              <li>🎯 <strong>Lucky Days:</strong> 15th, 22nd, 28th</li>
              <li>🎨 <strong>Power Colors:</strong> Blue, Silver, Purple</li>
              <li>💎 <strong>Crystal Guide:</strong> Amethyst for clarity</li>
            </ul>
          </div>
          
          <p style="margin-top: 20px;">Your personalized ${zodiacSign} horoscope PDF is attached below.</p>
          <p>May the stars light your path!</p>
          <p>Best wishes,<br>The Cosmic Calendar Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `${zodiacSign.toLowerCase()}-horoscope.pdf`,
          content: Buffer.from(`
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 24 Tf
100 700 Td
(🌟 Your Personal ${zodiacSign} Reading 🌟) Tj
/F1 16 Tf
100 650 Td
(Dear ${name},) Tj
100 620 Td
(Thank you for your purchase!) Tj
100 590 Td
(Your personalized horoscope reading.) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF
          `).toString('base64')
        }
      ]
    });

    console.log('Email sent successfully:', emailData);
    return res.status(200).json({ success: true, data: emailData });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
} 