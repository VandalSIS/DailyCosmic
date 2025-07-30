// Simple in-memory storage for subscribers (in production, use a database)
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

    // Store subscriber info with email as key for easy lookup
    const subscriberData = {
      name,
      email,
      zodiacSign,
      createdAt: new Date().toISOString(),
      status: 'pending' // Will be updated to 'active' when payment is confirmed
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

// Export function to get subscriber by email (for webhook use)
export function getSubscriberByEmail(email) {
  return subscribers.get(email);
}

// Export function to update subscriber status
export function updateSubscriberStatus(email, status) {
  const subscriber = subscribers.get(email);
  if (subscriber) {
    subscriber.status = status;
    subscriber.updatedAt = new Date().toISOString();
    subscribers.set(email, subscriber);
    return subscriber;
  }
  return null;
}