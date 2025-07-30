export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, zodiacSign } = req.body;
    
    if (!name || !email || !zodiacSign) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // For now, just return success to test the API endpoint
    return res.status(200).json({
      success: true,
      message: 'Subscription initiated',
      data: { name, email, zodiacSign }
    });
  } catch (error) {
    console.error('PayPal API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 