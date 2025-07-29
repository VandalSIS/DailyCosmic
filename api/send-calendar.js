export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('API called with:', req.body);
    
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found in environment');
      return res.status(500).json({
        success: false,
        emailSent: false,
        emailMessage: 'Server configuration error: API key missing'
      });
    }

    // Import Resend dynamically to catch import errors
    let Resend;
    try {
      const resendModule = await import('resend');
      Resend = resendModule.Resend;
    } catch (importError) {
      console.error('Failed to import Resend:', importError);
      return res.status(500).json({
        success: false,
        emailSent: false,
        emailMessage: 'Server error: Failed to load email service'
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email, zodiacSign, name } = req.body;

    if (!email || !zodiacSign || !name) {
      return res.status(400).json({ 
        success: false, 
        emailSent: false,
        emailMessage: 'Missing required fields: email, zodiacSign, or name' 
      });
    }

    // Get zodiac key (remove emoji)
    const zodiacKey = zodiacSign.split(' ')[0].toLowerCase();
    
    // Updated PDF URLs with proper encoding
    const zodiacPdfMapping = {
      aries: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/aries-calendar-TvKkvqf5gU4sV50Ze7zpMoZhHzmBHa.pdf',
      taurus: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/taurus-calendar-0z1DCFmeGIoZGd9nDS1irXLdUubLAz.pdf',
      gemini: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/gemini-calendar-vaDoM71E7xF6S72QsBXmujM38aBJqZ.pdf',
      cancer: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/cancer-calendar-RQCbA1n6KzAhLU0AzOwuepUoxzlkAD.pdf',
      leo: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/leo-calendar-6FtRD8yaWPCbQZHC8ZubG9O1GiHbIn.pdf',
      virgo: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/virgo-calendar-ZhDgkfAQaA7cdxdM0TWVj06GJghRpc.pdf',
      libra: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/libra-calendar-HezBGjxZjLoLEHKkvu1qj23ZTST2wv.pdf',
      scorpio: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/scorpio-calendar-VaR5QSMzAwbdvvQ3AlyORkxZx3ynVX.pdf',
      sagittarius: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/sagittarius-calendar-5VhvnUU2BY2v4FZIl7K5WkMVJdLvRC.pdf',
      capricorn: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/capricorn-calendar-S0lixufWlVh8LLDIwdu4kDyJrTkc4y.pdf',
      aquarius: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/aquarius-calendar-tAHcVTaM1xOEuyTAfHGHOPy2hUTe2L.pdf',
      pisces: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/pisces-calendar-twRDjWJGXqJJaPDdQMRgPKB06qLbqX.pdf'
    };
    
    // Get PDF URL for the zodiac sign
    const pdfUrl = zodiacPdfMapping[zodiacKey];
    if (!pdfUrl) {
      return res.status(400).json({
        success: false,
        emailSent: false,
        emailMessage: `PDF not available for ${zodiacSign}. Please contact support.`
      });
    }

    console.log('Fetching PDF for:', zodiacSign, 'from:', pdfUrl);
    
    // Fetch PDF
    let pdfBase64 = null;
    try {
      const pdfResponse = await fetch(pdfUrl);
      
      if (!pdfResponse.ok) {
        throw new Error(`HTTP error! status: ${pdfResponse.status}`);
      }
      
      const pdfBuffer = await pdfResponse.arrayBuffer();
      pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
      console.log('PDF fetched and converted to base64, size:', pdfBase64.length);
      
    } catch (error) {
      console.error('PDF fetch error:', error);
      return res.status(500).json({
        success: false,
        emailSent: false,
        emailMessage: `Failed to fetch PDF: ${error.message}`
      });
    }

    // Clean zodiac sign (remove emoji)
    const cleanZodiacSign = zodiacSign.split(' ')[0];

    // Prepare email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #fff; font-size: 28px; margin-bottom: 10px;">🌟 Cosmic Daily Planner</h1>
          <p style="color: #e0e0e0; font-size: 16px;">Your personalized zodiac calendar has arrived!</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #fff; margin-top: 0;">Hello ${name}! ✨</h2>
          <p style="color: #e0e0e0; line-height: 1.6;">
            Your <strong>${cleanZodiacSign} Daily Calendar</strong> is attached to this email! 
            This personalized calendar contains 365 days of cosmic guidance specifically tailored for your zodiac sign.
          </p>
          <p style="color: #e0e0e0; line-height: 1.6;">
            <strong>What's included:</strong><br>
            • 365 days of personalized daily guidance<br>
            • Cosmic insights and predictions<br>
            • Perfect timing for important decisions<br>
            • High-resolution PDF ready for printing
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #e0e0e0; font-size: 14px;">
            Thank you for choosing Cosmic Daily Planner! 🌟<br>
            May the stars guide your path to success and happiness.
          </p>
        </div>
      </div>
    `;

    // Prepare email data
    const emailData = {
      from: 'Cosmic Daily Planner <noreply@cadalunastro.com>',
      to: [email],
      subject: `🌟 Your ${cleanZodiacSign} Cosmic Calendar is Ready!`,
      html: emailContent,
      attachments: [
        {
          filename: `${zodiacKey}-cosmic-calendar.pdf`,
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ]
    };

    // Send email
    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({
        success: false,
        emailSent: false,
        emailMessage: `Failed to send email: ${error.message}`,
      });
    }

    console.log('Email sent successfully:', data);
    return res.status(200).json({
      success: true,
      emailSent: true,
      emailMessage: `Calendar sent successfully to ${email}`,
      pdfInfo: {
        displayName: `${cleanZodiacSign} Daily Calendar`,
        filename: `${zodiacKey}-calendar.pdf`,
      },
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      emailSent: false,
      emailMessage: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
} 