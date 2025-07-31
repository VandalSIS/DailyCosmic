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

    console.log('API key found, length:', process.env.RESEND_API_KEY.length);

    // Import Resend dynamically to catch import errors
    let Resend;
    try {
      const resendModule = await import('resend');
      Resend = resendModule.Resend;
      console.log('Resend imported successfully');
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

    console.log('Sending email to:', email, 'for:', zodiacSign);

    // Get zodiac key (remove emoji)
    const zodiacKey = zodiacSign.split(' ')[0].toLowerCase();
    
    // Import zodiac mapping to get PDF URL
    const zodiacPdfMapping = {
      aries: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/aries-calendar-TvKkvqf5gU4sV50Ze7zpMoZhHzmBHa.pdf',
      taurus: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Taurus%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-0z1DCFmeGIoZGd9nDS1irXLdUubLAz.pdf',
      gemini: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Gemini%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-vaDoM71E7xF6S72QsBXmujM38aBJqZ.pdf',
      cancer: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Cancer%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-RQCbA1n6KzAhLU0AzOwuepUoxzlkAD.pdf',
      leo: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Leo%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-6FtRD8yaWPCbQZHC8ZubG9O1GiHbIn.pdf',
      virgo: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Virgo%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-ZhDgkfAQaA7cdxdM0TWVj06GJghRpc.pdf',
      libra: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Libra%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-HezBGjxZjLoLEHKkvu1qj23ZTST2wv.pdf',
      scorpio: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Scorpio%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-VaR5QSMzAwbdvvQ3AlyORkxZx3ynVX.pdf',
      sagittarius: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Sagittarius%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-5VhvnUU2BY2v4FZIl7K5WkMVJdLvRC.pdf',
      capricorn: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Capricorn%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-S0lixufWlVh8LLDIwdu4kDyJrTkc4y.pdf',
      aquarius: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Aquarius%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-tAHcVTaM1xOEuyTAfHGHOPy2hUTe2L.pdf',
      pisces: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Pisces%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-twRDjWJGXqJJaPDdQMRgPKB06qLbqX.pdf'
    };
    
    // Check if PDF is available for this zodiac sign
    const pdfUrl = zodiacPdfMapping[zodiacKey];
    if (!pdfUrl) {
      return res.status(400).json({
        success: false,
        emailSent: false,
        emailMessage: `PDF not available for ${zodiacSign}. Please contact support.`
      });
    }

    // TEMPORARY: Use a working public PDF for testing
    const testPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    const ariesPdfUrl = 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/aries-calendar-TvKkvqf5gU4sV50Ze7zpMoZhHzmBHa.pdf';

    console.log('Fetching PDF from:', ariesPdfUrl, '(using CORRECT URL now)');
    console.log('Fetching PDF for:', zodiacSign, 'from:', pdfUrl);

    // Fetch PDF - try the correct URL
    let pdfBase64 = null;
    let pdfError = null;
    
    try {
      console.log('Starting PDF fetch with CORRECT URL...');
      console.log('Starting PDF fetch for', zodiacKey, '...');
      
      // Use the correct PDF URL for the zodiac sign
      const pdfResponse = await fetch(pdfUrl);
      
      console.log('PDF Response status:', pdfResponse.status);
      console.log('PDF Response statusText:', pdfResponse.statusText);
      
      if (pdfResponse.status === 200) {
        console.log('PDF fetched successfully, converting to base64...');
        const pdfBuffer = await pdfResponse.arrayBuffer();
        pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
        console.log('PDF converted to base64, size:', pdfBase64.length);
      } else {
        pdfError = `Failed to fetch PDF: ${pdfResponse.status} ${pdfResponse.statusText}`;
        console.error('PDF fetch failed:', pdfError);
      }
      
    } catch (error) {
      pdfError = `PDF fetch error: ${error.message}`;
      console.error('PDF fetch exception:', pdfError);
      console.error('Full error:', error);
      console.error('Error stack:', error.stack);
    }

    console.log('PDF fetch completed. pdfBase64 length:', pdfBase64 ? pdfBase64.length : 'null');
    console.log('PDF error:', pdfError);

    // Clean zodiac sign (remove emoji)
    const cleanZodiacSign = zodiacSign.split(' ')[0];

    console.log('Sending email via Resend...');

    // Prepare email content
    const emailContent = pdfBase64 ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fff; font-size: 28px; margin-bottom: 10px;">🌟 Cosmic Daily Planner</h1>
            <p style="color: #e0e0e0; font-size: 16px;">Your personalized zodiac calendar has arrived!</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #fff; margin-top: 0;">Hello ${name}! ✨</h2>
            <p style="color: #e0e0e0; line-height: 1.6;">
              Your FREE <strong>${cleanZodiacSign} Daily Calendar</strong> is attached to this email! 
              This personalized calendar contains 365 days of cosmic guidance specifically tailored for your zodiac sign.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #e0e0e0; font-size: 14px;">
              Thank you for choosing Cosmic Daily Planner! 🌟<br>
              May the stars guide your path to success and happiness.
            </p>
          </div>
        </div>
      ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fff; font-size: 28px; margin-bottom: 10px;">🌟 Cosmic Daily Planner</h1>
            <p style="color: #e0e0e0; font-size: 16px;">Your calendar request has been received!</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #fff; margin-top: 0;">Hello ${name}! ✨</h2>
            <p style="color: #e0e0e0; line-height: 1.6;">
              Thank you for your interest in our FREE <strong>${cleanZodiacSign} Daily Calendar</strong>!
            </p>
            <p style="color: #e0e0e0; line-height: 1.6;">
              We're currently updating our PDF storage system. Your personalized calendar will be sent to you within 24 hours.
            </p>
            <p style="color: #e0e0e0; line-height: 1.6;">
              <strong>What you'll receive:</strong><br>
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

    // Prepare email data with HTML content only (no PDF attachment)
    const emailData = {
      from: 'Cosmic Daily Planner <noreply@cadalunastro.com>',
      to: [email],
      subject: `🌟 Your FREE ${cleanZodiacSign} Horoscope Reading`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fff; font-size: 28px; margin-bottom: 10px;">🌟 Your FREE ${cleanZodiacSign} Reading 🌟</h1>
            <p style="color: #e0e0e0; font-size: 16px;">A gift from the stars just for you!</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #fff; margin-top: 0;">Hello ${name}! ✨</h2>
            <p style="color: #e0e0e0; line-height: 1.6;">
              Here's your FREE <strong>${cleanZodiacSign} horoscope reading</strong> as a special gift!
            </p>
            
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="color: #fff; margin-top: 0;">✨ Your ${cleanZodiacSign} Insights:</h3>
              <ul style="color: #e0e0e0; line-height: 1.6; padding-left: 20px;">
                <li><strong>Career:</strong> New opportunities are coming your way</li>
                <li><strong>Love:</strong> Open your heart to new connections</li>
                <li><strong>Health:</strong> Focus on balance and self-care</li>
                <li><strong>Money:</strong> Good financial decisions ahead</li>
              </ul>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="color: #fff; margin-top: 0;">🎯 Quick Tips:</h3>
              <p style="color: #e0e0e0; line-height: 1.6;">
                <strong>Lucky Day:</strong> This weekend<br>
                <strong>Power Color:</strong> Blue<br>
                <strong>Focus:</strong> Communication and learning
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #e0e0e0; font-size: 14px;">
              Want your <strong>complete 365-day horoscope calendar</strong>?<br>
              Get the full experience with our premium reading! 🌟
            </p>
            <p style="color: #e0e0e0; font-size: 12px; margin-top: 10px;">
              Thank you for choosing Cosmic Daily Planner!<br>
              May the stars guide your path to success and happiness.
            </p>
          </div>
        </div>
      `
    };

    // Send email with Resend using your verified domain
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
      emailMessage: `Free horoscope reading sent successfully to ${email}`,
      pdfInfo: {
        displayName: `${cleanZodiacSign} Free Reading`,
        filename: null, // No PDF attachment
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