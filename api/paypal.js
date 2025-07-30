import { sendEmail } from './lib/emailService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body;

  try {
    switch (action) {
      case 'create-subscription':
        const { name, email, zodiacSign } = req.body;
        // Handle subscription creation
        // This is simplified - you'll need to add your actual PayPal API calls here
        const subscriptionId = "TEMP_" + Date.now();
        
        // Send welcome email with PDF
        await sendEmail({
          to: email,
          subject: "Welcome to Cosmic Calendar",
          pdfName: `${zodiacSign.toLowerCase()}-calendar.pdf`,
          userName: name
        });

        return res.status(200).json({ subscriptionId });

      case 'cancel-subscription':
        const { subId } = req.body;
        // Handle subscription cancellation
        // Add your PayPal cancellation logic here
        return res.status(200).json({ message: 'Subscription cancelled' });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('PayPal API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 