import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get PayPal headers for webhook verification
    const paypalTransmissionId = req.headers['paypal-transmission-id'];
    const paypalCertId = req.headers['paypal-cert-id'];
    const paypalTransmissionSig = req.headers['paypal-transmission-sig'];
    const paypalTransmissionTime = req.headers['paypal-transmission-time'];
    
    const webhookBody = JSON.stringify(req.body);
    console.log('PayPal Webhook received:', {
      event_type: req.body.event_type,
      resource_type: req.body.resource_type,
      headers: {
        paypalTransmissionId,
        paypalCertId,
        paypalTransmissionSig,
        paypalTransmissionTime
      }
    });

    // Handle different webhook events
    const eventType = req.body.event_type;
    
    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      console.log('✅ Subscription activated:', req.body.resource.id);
      
      // Extract subscriber info from custom_id if available
      const customId = req.body.resource.custom_id;
      const subscriptionId = req.body.resource.id;
      
      console.log('Subscription details:', {
        subscriptionId,
        customId,
        status: req.body.resource.status
      });
      
    } else if (eventType === 'PAYMENT.SALE.COMPLETED') {
      console.log('💰 Payment completed!');
      
      const paymentInfo = req.body.resource;
      const subscriptionId = paymentInfo.billing_agreement_id;
      
      console.log('Payment details:', {
        paymentId: paymentInfo.id,
        subscriptionId,
        amount: paymentInfo.amount,
        payerEmail: paymentInfo.payer?.payer_info?.email
      });
      
      // This is where we send the PDF!
      await sendPdfToSubscriber(paymentInfo, subscriptionId);
      
    } else if (eventType === 'BILLING.SUBSCRIPTION.PAYMENT.COMPLETED') {
      console.log('💰 Subscription payment completed!');
      
      const paymentInfo = req.body.resource;
      const subscriptionId = paymentInfo.billing_agreement_id;
      
      console.log('Subscription payment details:', {
        subscriptionId,
        amount: paymentInfo.amount_with_breakdown,
        status: paymentInfo.status
      });
      
      // Send PDF for subscription payment
      await sendPdfToSubscriber(paymentInfo, subscriptionId);
    }

    return res.status(200).json({ success: true, message: 'Webhook processed' });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function sendPdfToSubscriber(paymentInfo, subscriptionId) {
  try {
    console.log('🚀 Sending PDF for confirmed payment...');
    
    // Get email from PayPal payment info
    const email = paymentInfo.payer?.payer_info?.email || paymentInfo.payer?.email_address;
    
    if (!email) {
      console.error('No email found in payment info');
      return;
    }
    
    // Import subscriber functions
    const { getSubscriberByEmail, updateSubscriberStatus } = await import('./store-subscriber.js');
    
    // Look up subscriber details by email
    const subscriber = getSubscriberByEmail(email);
    
    if (!subscriber) {
      console.error('No subscriber found for email:', email);
      // Still try to send with basic info from PayPal
      var zodiacSign = 'Gemini'; // Default fallback
      var name = paymentInfo.payer?.payer_info?.first_name || 'Valued Customer';
    } else {
      // Use stored subscriber info
      var zodiacSign = subscriber.zodiacSign;
      var name = subscriber.name;
      
      // Update subscriber status to active
      updateSubscriberStatus(email, 'active');
      console.log('✅ Subscriber activated:', subscriber);
    }
    
    const { Resend } = await import('resend');
    const { getSignedUrl } = await import('@vercel/blob');
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
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
      subject: '🎉 Payment Confirmed - Your Cosmic Calendar PDF!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">🌟 Payment Confirmed! 🌟</h1>
          
          <p>Dear ${name},</p>
          
          <p><strong>Great news!</strong> Your payment has been confirmed by PayPal and your personalized horoscope is attached to this email.</p>
          
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
          
          <p>Thank you for your subscription!</p>
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

    console.log('✅ PDF sent successfully via webhook:', emailData);
    
  } catch (error) {
    console.error('❌ Error sending PDF via webhook:', error);
  }
}