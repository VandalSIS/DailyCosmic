export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required field: subscriptionId' 
      });
    }

    console.log('🎯 Cancelling PayPal subscription:', subscriptionId);

    // PayPal configuration
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const paypalEnv = process.env.PAYPAL_ENVIRONMENT || 'sandbox';
    
    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    // PayPal API URL
    const apiUrl = paypalEnv === 'production' 
      ? 'https://api.paypal.com'
      : 'https://api.sandbox.paypal.com';

    // Step 1: Get PayPal Access Token
    const tokenResponse = await fetch(`${apiUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Failed to get PayPal access token: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Cancel the subscription
    const cancelResponse = await fetch(`${apiUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        reason: 'Customer requested cancellation'
      })
    });

    if (!cancelResponse.ok) {
      const errorText = await cancelResponse.text();
      throw new Error(`Failed to cancel subscription: ${errorText}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('❌ PayPal subscription cancellation error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to cancel PayPal subscription',
      details: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
} 