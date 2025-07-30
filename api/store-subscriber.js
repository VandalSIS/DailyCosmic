// Simple storage for subscribers 
const subscribers = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, zodiacSign } = req.body;

    if (!name || !email || !zodiacSign) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Store subscriber info
    const subscriberData = {
      name,
      email,
      zodiacSign,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    subscribers.set(email, subscriberData);
    
    console.log('✅ Subscriber stored:', subscriberData);
    
    return res.status(200).json({
      success: true,
      message: 'Subscriber information stored',
      data: { email, name, zodiacSign }
    });

  } catch (error) {
    console.error('Error storing subscriber:', error);
    return res.status(500).json({ error: 'Failed to store subscriber information' });
  }
}

// Export function to get all subscribers
export function getAllSubscribers() {
  return subscribers;
}