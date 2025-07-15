import { getPdfUrl } from './zodiacPdfMapping';

// Mock email service for development
export const mockEmailService = {
  async sendEmail(to: string, subject: string, html: string, attachments?: { filename: string; content: Buffer }[]): Promise<boolean> {
    console.log('📧 Mock Email Service - Sending email...');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML length:', html.length);
    console.log('Attachments:', attachments?.length || 0);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Mock email sent successfully');
    return true;
  }
};

// Production email service (replace with your actual service)
export const emailService = {
  async sendEmail(to: string, subject: string, html: string, attachments?: { filename: string; content: Buffer }[]): Promise<boolean> {
    try {
      // TODO: Replace with your actual email service (SendGrid, Nodemailer, etc.)
      // For now, using mock service
      return await mockEmailService.sendEmail(to, subject, html, attachments);
    } catch (error) {
      console.error('❌ Email service error:', error);
      return false;
    }
  }
};

// Helper function to fetch PDF from Vercel Blob
async function fetchPdfFromBlob(blobUrl: string): Promise<Buffer> {
  try {
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('❌ Error fetching PDF from Blob:', error);
    throw error;
  }
}

// Send zodiac calendar via email
export async function sendZodiacCalendar(
  customerName: string,
  customerEmail: string,
  zodiacSign: string,
  orderType: 'free' | 'paid' = 'free'
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`📧 Sending ${orderType} zodiac calendar to ${customerEmail}`);
    
    // Get PDF URL from Vercel Blob
    const pdfUrl = getPdfUrl(zodiacSign);
    if (!pdfUrl) {
      throw new Error(`PDF not found for zodiac sign: ${zodiacSign}`);
    }

    // Fetch PDF from Vercel Blob
    const pdfBuffer = await fetchPdfFromBlob(pdfUrl);
    
    // Create email content
    const subject = orderType === 'free' 
      ? `🌟 Your FREE ${zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)} Cosmic Daily Planner`
      : `🌟 Your ${zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1)} Cosmic Daily Planner - Order Confirmed`;
    
    const html = generateEmailTemplate(customerName, zodiacSign, orderType);
    
    // Prepare attachment
    const attachments = [{
      filename: `${zodiacSign}-cosmic-daily-planner.pdf`,
      content: pdfBuffer
    }];
    
    // Send email
    const success = await emailService.sendEmail(customerEmail, subject, html, attachments);
    
    if (success) {
      console.log(`✅ ${orderType} calendar sent successfully to ${customerEmail}`);
      return { success: true };
    } else {
      throw new Error('Email service failed');
    }
  } catch (error) {
    console.error('❌ Error sending zodiac calendar:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Generate email template
function generateEmailTemplate(customerName: string, zodiacSign: string, orderType: 'free' | 'paid'): string {
  const capitalizedSign = zodiacSign.charAt(0).toUpperCase() + zodiacSign.slice(1);
  
  const freeEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🌟 Your FREE Cosmic Daily Planner</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Specially crafted for ${capitalizedSign}</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Hello ${customerName}! ✨</h2>
        
        <p style="color: #666; line-height: 1.6;">
          Thank you for choosing Cosmic Daily Planner! Your personalized <strong>${capitalizedSign}</strong> cosmic calendar is attached to this email.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">📅 What's Inside Your Planner:</h3>
          <ul style="color: #666; line-height: 1.8;">
            <li>Daily cosmic insights tailored for ${capitalizedSign}</li>
            <li>Moon phase calendar with optimal timing</li>
            <li>Personalized affirmations and mantras</li>
            <li>Goal-setting templates aligned with your sign</li>
            <li>Monthly horoscope predictions</li>
          </ul>
        </div>
        
        <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3436; margin-top: 0;">🚀 Want Even More Cosmic Guidance?</h3>
          <p style="color: #2d3436; margin: 10px 0;">
            Upgrade to our <strong>Premium Cosmic Experience</strong> and unlock:
          </p>
          <ul style="color: #2d3436; line-height: 1.6;">
            <li>Weekly personalized readings</li>
            <li>Compatibility reports</li>
            <li>Lucky numbers and dates</li>
            <li>Chakra balancing guides</li>
          </ul>
          <p style="color: #2d3436; margin: 15px 0 0 0;">
            <em>Premium subscription coming soon! 🌙</em>
          </p>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          Start your cosmic journey today and align your daily life with the universe's energy!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            With cosmic love,<br>
            <strong style="color: #667eea;">The Cosmic Daily Planner Team</strong>
          </p>
        </div>
      </div>
    </div>
  `;

  const paidEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🌟 Order Confirmed!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your ${capitalizedSign} Cosmic Daily Planner</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Thank you ${customerName}! ✨</h2>
        
        <p style="color: #666; line-height: 1.6;">
          Your order has been confirmed and your personalized <strong>${capitalizedSign}</strong> cosmic calendar is attached to this email.
        </p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #155724; margin-top: 0;">✅ Order Details:</h3>
          <p style="color: #155724; margin: 5px 0;"><strong>Product:</strong> ${capitalizedSign} Cosmic Daily Planner</p>
          <p style="color: #155724; margin: 5px 0;"><strong>Format:</strong> PDF Download</p>
          <p style="color: #155724; margin: 5px 0;"><strong>Status:</strong> Delivered</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">📅 What's Inside Your Planner:</h3>
          <ul style="color: #666; line-height: 1.8;">
            <li>Daily cosmic insights tailored for ${capitalizedSign}</li>
            <li>Moon phase calendar with optimal timing</li>
            <li>Personalized affirmations and mantras</li>
            <li>Goal-setting templates aligned with your sign</li>
            <li>Monthly horoscope predictions</li>
          </ul>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          Start your cosmic journey today and align your daily life with the universe's energy!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            Need help? Reply to this email or contact our support team.<br>
            <strong style="color: #667eea;">The Cosmic Daily Planner Team</strong>
          </p>
        </div>
      </div>
    </div>
  `;

  return orderType === 'free' ? freeEmailContent : paidEmailContent;
}

 