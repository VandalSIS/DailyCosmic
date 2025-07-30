import { Resend } from 'resend';
import { getSignedUrl } from '@vercel/blob';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, zodiacSign, isWelcomeEmail } = req.body;

    if (!name || !email || !zodiacSign) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get PDF URL from Vercel Blob
    const pdfFileName = `${zodiacSign.toLowerCase()}-calendar.pdf`;
    
    // Create signed URL for the PDF
    const { url: pdfUrl } = await getSignedUrl(pdfFileName, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
      options: { access: 'public' }
    });

    // Send email with PDF
    const emailData = await resend.emails.send({
      from: 'noreply@cadalunastro.com',
      to: email,
      subject: isWelcomeEmail ? 'Welcome to Cosmic Calendar! 🌟' : 'Your Monthly Cosmic Calendar 📅',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">🌟 Welcome to Cosmic Calendar! 🌟</h1>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for subscribing to our monthly cosmic calendar! Your personalized horoscope is attached to this email.</p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2>✨ What's Included:</h2>
            <ul>
              <li>Personalized insights for ${zodiacSign}</li>
              <li>Monthly horoscope predictions</li>
              <li>Cosmic event highlights</li>
              <li>Printable high-quality PDF</li>
            </ul>
          </div>

          <p><strong>Next delivery:</strong> 15th of each month</p>
          
          <p>If you don't see the PDF attachment, please check your spam folder.</p>
          
          <p>Best regards,<br>The Cosmic Calendar Team</p>
        </div>
      `,
      attachments: [
        {
          filename: pdfFileName,
          content: await fetch(pdfUrl).then(res => res.arrayBuffer())
        }
      ]
    });

    console.log('Email sent successfully:', emailData);
    return res.status(200).json({ success: true, message: 'PDF sent successfully' });

  } catch (error) {
    console.error('Error sending PDF:', error);
    return res.status(500).json({ error: 'Failed to send PDF' });
  }
} 