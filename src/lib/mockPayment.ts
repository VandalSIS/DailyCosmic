import { zodiacPdfMapping, getPdfUrl } from './zodiacPdfMapping';

// Client-side service that calls our serverless function
const sendEmailViaServerless = async (email: string, zodiacSign: string, name: string) => {
  try {
    const response = await fetch('/api/send-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        zodiacSign,
        name
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling serverless function:', error);
    return {
      success: false,
      emailSent: false,
      emailMessage: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

// Local development mock email service
const sendEmailLocally = async (email: string, zodiacSign: string, name: string) => {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const cleanZodiacSign = zodiacSign.split(' ')[0];
  
  // Log the email content to console for testing
  console.log('📧 EMAIL SENT (LOCAL TESTING)');
  console.log('===============================');
  console.log(`To: ${email}`);
  console.log(`Subject: 🌟 Your FREE ${cleanZodiacSign} Calendar is Ready!`);
  console.log(`PDF: ${cleanZodiacSign} Daily Calendar`);
  console.log('===============================');
  console.log(`Hello ${name}! ✨`);
  console.log(`Your FREE ${cleanZodiacSign} Daily Calendar is ready!`);
  console.log('This personalized calendar contains 365 days of cosmic guidance.');
  console.log('===============================');
  console.log('📎 PDF Attachment: aries-calendar.pdf');
  console.log('Note: In production, this will be sent to your actual email!');
  
  return {
    success: true,
    emailSent: true,
    emailMessage: `Calendar sent successfully to ${email} (LOCAL TESTING - Check console)`,
    pdfInfo: {
      displayName: `${cleanZodiacSign} Daily Calendar`,
      filename: `${cleanZodiacSign.toLowerCase()}-calendar.pdf`,
    },
  };
};

// Mock payment system for development
export const mockPayment = {
  // Send free zodiac calendar (no payment required)
  sendFreeCalendar: async (email: string, zodiacSign: string, name: string) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate free order ID
    const orderId = `FREE-${Math.random().toString(36).substr(2, 9)}`;
    
    // Check if PDF is available
    const pdfUrl = getPdfUrl(zodiacSign);
    if (!pdfUrl) {
      return {
        success: false,
        orderId,
        amount: "0.00",
        email,
        zodiacSign,
        date: new Date().toISOString(),
        emailSent: false,
        emailMessage: `PDF not available for ${zodiacSign}. Please contact support.`,
        pdfInfo: null
      };
    }

    // Always use real email service - no fallback to mock
    console.log('🚀 Sending real email via Resend...');
    const emailResult = await sendEmailViaServerless(email, zodiacSign, name);
    
    if (!emailResult.success || !emailResult.emailSent) {
      console.log('❌ Real email failed:', emailResult.emailMessage);
      return {
        success: false,
        orderId,
        amount: "0.00",
        email,
        zodiacSign,
        date: new Date().toISOString(),
        emailSent: false,
        emailMessage: emailResult.emailMessage || 'Failed to send email',
        pdfInfo: null
      };
    }
    
    console.log('✅ Real email sent successfully!');
    return {
      success: true,
      orderId,
      amount: "0.00",
      email,
      zodiacSign,
      date: new Date().toISOString(),
      emailSent: emailResult.emailSent,
      emailMessage: emailResult.emailMessage,
      pdfInfo: emailResult.pdfInfo
    };
  },

  // Paid subscription (for later PayPal integration)
  processPayment: async (amount: string, email: string, zodiacSign: string, name: string) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate order ID
    const orderId = `ORDER-${Math.random().toString(36).substr(2, 9)}`;
    
    // Check if PDF is available
    const pdfUrl = getPdfUrl(zodiacSign);
    if (!pdfUrl) {
      return {
        success: false,
        orderId,
        amount,
        email,
        zodiacSign,
        date: new Date().toISOString(),
        emailSent: false,
        emailMessage: `PDF not available for ${zodiacSign}. Please contact support.`,
        pdfInfo: null
      };
    }

    // Always use real email service - no fallback to mock
    const emailResult = await sendEmailViaServerless(email, zodiacSign, name);
    
    if (!emailResult.success || !emailResult.emailSent) {
      return {
        success: false,
        orderId,
        amount,
        email,
        zodiacSign,
        date: new Date().toISOString(),
        emailSent: false,
        emailMessage: emailResult.emailMessage || 'Failed to send email',
        pdfInfo: null
      };
    }
    
    return {
      success: true,
      orderId,
      amount,
      email,
      zodiacSign,
      date: new Date().toISOString(),
      emailSent: emailResult.emailSent,
      emailMessage: emailResult.emailMessage,
      pdfInfo: emailResult.pdfInfo
    };
  }
}; 