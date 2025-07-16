// PayPal Subscription Service
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  interval: 'month' | 'year';
}

export interface Subscriber {
  id: string;
  email: string;
  name: string;
  zodiacSign: string;
  subscriptionId: string;
  status: 'active' | 'cancelled' | 'expired';
  nextBillingDate: string;
  createdAt: string;
}

// Test subscription plan - 1 cent for testing
export const TEST_SUBSCRIPTION_PLAN: SubscriptionPlan = {
  id: 'cosmic-monthly-test',
  name: 'Cosmic Horoscope Monthly - Test',
  description: 'Monthly personalized horoscope delivery (Test version)',
  price: '0.01', // 1 cent for testing
  currency: 'USD',
  interval: 'month'
};

// Production subscription plan - $10/month
export const PRODUCTION_SUBSCRIPTION_PLAN: SubscriptionPlan = {
  id: 'cosmic-monthly-prod',
  name: 'Cosmic Horoscope Monthly',
  description: 'Monthly personalized horoscope delivery',
  price: '10.00',
  currency: 'USD',
  interval: 'month'
};

// Get current plan based on environment
export function getCurrentPlan(): SubscriptionPlan {
  // Always use test plan for now (1¢) - even in production with sandbox
  return TEST_SUBSCRIPTION_PLAN;
}

// PayPal API base URL
export function getPayPalApiUrl(): string {
  // Check if explicitly set to sandbox or if in development
  const paypalEnv = process.env.PAYPAL_ENVIRONMENT || 'sandbox';
  const isProduction = paypalEnv === 'production' && process.env.NODE_ENV === 'production';
  
  return isProduction 
    ? 'https://api.paypal.com'
    : 'https://api.sandbox.paypal.com';
}

// PayPal subscription creation
export async function createSubscriptionPlan(plan: SubscriptionPlan): Promise<any> {
  const apiUrl = getPayPalApiUrl();
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  try {
    // Get access token
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
      throw new Error('Failed to get PayPal access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create product for the subscription
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
        name: plan.name,
        description: plan.description,
        type: 'SERVICE',
        category: 'SOFTWARE'
      })
    });

    if (!productResponse.ok) {
      const errorText = await productResponse.text();
      console.error('PayPal product creation failed:', errorText);
      throw new Error('Failed to create PayPal product');
    }

    const productData = await productResponse.json();
    console.log('PayPal product created:', productData.id);

    // Create billing plan
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
        name: plan.name,
        description: plan.description,
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
                value: plan.price,
                currency_code: plan.currency
              }
            }
          }
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee: {
            value: '0',
            currency_code: plan.currency
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
      console.error('PayPal plan creation failed:', errorText);
      throw new Error('Failed to create PayPal billing plan');
    }

    const planData = await planResponse.json();
    console.log('PayPal billing plan created:', planData.id);

    return {
      success: true,
      productId: productData.id,
      planId: planData.id,
      plan: planData
    };

  } catch (error) {
    console.error('PayPal setup error:', error);
    throw error;
  }
}

// Create subscription for a user
export async function createSubscription(planId: string, subscriberData: {
  name: string;
  email: string;
  zodiacSign: string;
}): Promise<any> {
  const apiUrl = getPayPalApiUrl();
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  try {
    // Get access token
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

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create subscription
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
        plan_id: planId,
        start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Start tomorrow
        subscriber: {
          name: {
            given_name: subscriberData.name.split(' ')[0] || subscriberData.name,
            surname: subscriberData.name.split(' ').slice(1).join(' ') || ''
          },
          email_address: subscriberData.email
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
          return_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/subscription-success`,
          cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/subscription-cancelled`
        },
        custom_id: `cosmic-${subscriberData.zodiacSign}-${Date.now()}`
      })
    });

    if (!subscriptionResponse.ok) {
      const errorText = await subscriptionResponse.text();
      console.error('PayPal subscription creation failed:', errorText);
      throw new Error('Failed to create PayPal subscription');
    }

    const subscriptionData = await subscriptionResponse.json();
    
    return {
      success: true,
      subscriptionId: subscriptionData.id,
      approvalUrl: subscriptionData.links.find((link: any) => link.rel === 'approve')?.href,
      subscription: subscriptionData
    };

  } catch (error) {
    console.error('PayPal subscription creation error:', error);
    throw error;
  }
}

// Webhook signature verification
export async function verifyWebhookSignature(
  headers: any,
  body: string,
  webhookId: string
): Promise<boolean> {
  try {
    const authAlgo = headers['paypal-auth-algo'];
    const transmission_id = headers['paypal-transmission-id'];
    const cert_id = headers['paypal-cert-id'];
    const transmission_sig = headers['paypal-transmission-sig'];
    const transmission_time = headers['paypal-transmission-time'];

    const apiUrl = getPayPalApiUrl();
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    // Get access token
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

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Verify signature
    const verifyResponse = await fetch(`${apiUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_id: cert_id,
        transmission_id: transmission_id,
        transmission_sig: transmission_sig,
        transmission_time: transmission_time,
        webhook_id: webhookId,
        webhook_event: JSON.parse(body)
      })
    });

    if (!verifyResponse.ok) {
      return false;
    }

    const verifyData = await verifyResponse.json();
    return verifyData.verification_status === 'SUCCESS';

  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
} 