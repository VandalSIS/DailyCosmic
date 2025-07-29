import { updateSubscriberPayPalId } from './lib/subscriptionManager.js';

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
    const { name, email, zodiacSign, subscriberId } = req.body;

    if (!name || !email || !zodiacSign || !subscriberId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: name, email, zodiacSign, subscriberId' 
      });
    }

    console.log('🎯 Creating PayPal subscription for:', { name, email, zodiacSign, subscriberId });

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

    console.log('🔧 Using PayPal API:', apiUrl);

    // Test subscription plan (1¢ for testing)
    const testPlan = {
      name: 'Cosmic Horoscope Monthly - Test',
      description: 'Monthly personalized horoscope delivery (Test version)',
      price: '0.01',
      currency: 'USD'
    };

    // Step 1: Get PayPal Access Token
    console.log('🔑 Getting PayPal access token...');
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
    console.log('✅ Access token obtained');

    // Step 2: Create PayPal Product
    console.log('🏗️ Creating PayPal product...');
    const productResponse = await fetch(`${apiUrl}/v1/catalogs/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'PayPal-Request-Id': `cosmic-product-${Date.now()}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: testPlan.name,
        description: testPlan.description,
        type: 'SERVICE',
        category: 'SOFTWARE'
      })
    });

    if (!productResponse.ok) {
      const errorText = await productResponse.text();
      throw new Error(`Failed to create PayPal product: ${errorText}`);
    }

    const productData = await productResponse.json();
    console.log('✅ Product created:', productData.id);

    // Step 3: Create PayPal Billing Plan
    console.log('📋 Creating PayPal billing plan...');
    const planResponse = await fetch(`${apiUrl}/v1/billing/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'PayPal-Request-Id': `cosmic-plan-${Date.now()}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        product_id: productData.id,
        name: testPlan.name,
        description: testPlan.description,
        status: 'ACTIVE',
        billing_cycles: [
          {
            frequency: {
              interval_unit: 'MONTH',
              interval_count: 1
            },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 0, // Infinite billing cycles
            pricing_scheme: {
              fixed_price: {
                value: testPlan.price,
                currency_code: testPlan.currency
              }
            }
          }
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee: {
            value: '0',
            currency_code: testPlan.currency
          },
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3
        },
        taxes: {
          percentage: '0',
          inclusive: false
        }
      })
    });

    if (!planResponse.ok) {
      const errorText = await planResponse.text();
      throw new Error(`Failed to create PayPal billing plan: ${errorText}`);
    }

    const planData = await planResponse.json();
    console.log('✅ Billing plan created:', planData.id);

    // Step 4: Create Subscription
    console.log('👤 Creating subscription...');
    
    // Get the domain for return URLs
    const domain = req.headers.host || 'localhost:3000';
    const protocol = domain.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${domain}`;

    const subscriptionResponse = await fetch(`${apiUrl}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'PayPal-Request-Id': `cosmic-sub-${Date.now()}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        plan_id: planData.id,
        start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Start tomorrow
        subscriber: {
          name: {
            given_name: name.split(' ')[0] || name,
            surname: name.split(' ').slice(1).join(' ') || ''
          },
          email_address: email
        },
        application_context: {
          brand_name: 'Cosmic Daily Planner',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
          },
          return_url: `${baseUrl}/subscription-success?subscriberId=${subscriberId}`,
          cancel_url: `${baseUrl}/subscription-cancelled`
        },
        custom_id: `cosmic-${zodiacSign.split(' ')[0]}-${subscriberId}`
      })
    });

    if (!subscriptionResponse.ok) {
      const errorText = await subscriptionResponse.text();
      throw new Error(`Failed to create PayPal subscription: ${errorText}`);
    }

    const subscriptionData = await subscriptionResponse.json();
    console.log('✅ Subscription created:', subscriptionData.id);

    // Find approval URL
    const approvalUrl = subscriptionData.links?.find(link => link.rel === 'approve')?.href;
    
    if (!approvalUrl) {
      throw new Error('No approval URL received from PayPal');
    }

    // Update subscriber with PayPal subscription ID
    updateSubscriberPayPalId(subscriberId, subscriptionData.id);

    return res.status(200).json({
      success: true,
      message: 'Subscription created successfully',
      data: {
        planId: planData.id,
        productId: productData.id,
        subscriptionId: subscriptionData.id,
        approvalUrl: approvalUrl,
        plan: testPlan
      }
    });

  } catch (error) {
    console.error('❌ PayPal subscription creation error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create PayPal subscription',
      details: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
} 