export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, zodiacSign, subscriptionId } = req.body;

    if (!name || !email || !zodiacSign) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send welcome PDF email
    try {
      const emailResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/send-calendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          zodiacSign,
          isWelcomeEmail: true
        })
      });

      if (emailResponse.ok) {
        console.log('Welcome PDF sent successfully');
      } else {
        console.error('Failed to send welcome PDF');
      }
    } catch (emailError) {
      console.error('Error sending welcome PDF:', emailError);
    }

    return res.status(200).json({
      success: true,
      message: 'Subscription created and welcome PDF sent',
      data: { name, email, zodiacSign, subscriptionId }
    });
  } catch (error) {
    console.error('PayPal API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 