import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailResult {
  success: boolean;
  emailSent: boolean;
  emailMessage?: string;
  pdfInfo?: {
    displayName: string;
    filename: string;
  };
}

export const sendZodiacCalendarEmail = async (
  toEmail: string,
  zodiacSign: string,
  userName: string,
  pdfUrl: string,
  pdfFilename: string
): Promise<EmailResult> => {
  try {
    // Fetch PDF from Blob storage
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

    // Clean zodiac sign (remove emoji)
    const cleanZodiacSign = zodiacSign.split(' ')[0];

    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: 'Cosmic Daily Planner <onboarding@resend.dev>', // Use your domain once verified
      to: [toEmail],
      subject: `🌟 Your FREE ${cleanZodiacSign} Calendar is Ready!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fff; font-size: 28px; margin-bottom: 10px;">🌟 Cosmic Daily Planner</h1>
            <p style="color: #e0e0e0; font-size: 16px;">Your personalized zodiac calendar has arrived!</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #fff; margin-top: 0;">Hello ${userName}! ✨</h2>
            <p style="color: #e0e0e0; line-height: 1.6;">
              Your FREE <strong>${cleanZodiacSign} Daily Calendar</strong> is attached to this email! 
              This personalized calendar contains 365 days of cosmic guidance specifically tailored for your zodiac sign.
            </p>
          </div>

          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #fff; margin-top: 0;">What's Inside Your Calendar:</h3>
            <ul style="color: #e0e0e0; line-height: 1.8;">
              <li>📅 365 days of personalized daily guidance</li>
              <li>⭐ Daily do's and don'ts for ${cleanZodiacSign}</li>
              <li>🌙 Cosmic insights and predictions</li>
              <li>🎯 Perfect timing for important decisions</li>
              <li>🖨️ High-resolution PDF ready for printing</li>
            </ul>
          </div>

          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #fff; margin-top: 0;">How to Use Your Calendar:</h3>
            <ol style="color: #e0e0e0; line-height: 1.8;">
              <li>Download the attached PDF file</li>
              <li>Open it with any PDF reader</li>
              <li>Print it out or view it digitally</li>
              <li>Check your daily guidance every morning</li>
              <li>Follow the cosmic recommendations for best results</li>
            </ol>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #e0e0e0; font-size: 14px;">
              Thank you for choosing Cosmic Daily Planner! 🌟<br>
              May the stars guide your path to success and happiness.
            </p>
            <p style="color: #b0b0b0; font-size: 12px; margin-top: 20px;">
              If you have any questions, simply reply to this email.<br>
              We're here to help you navigate your cosmic journey! ✨
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        emailSent: false,
        emailMessage: `Failed to send email: ${error.message}`,
      };
    }

    console.log('Email sent successfully:', data);
    return {
      success: true,
      emailSent: true,
      emailMessage: `Calendar sent successfully to ${toEmail}`,
      pdfInfo: {
        displayName: `${cleanZodiacSign} Daily Calendar`,
        filename: pdfFilename,
      },
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      emailSent: false,
      emailMessage: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}; 