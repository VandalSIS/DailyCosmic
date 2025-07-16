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
    const { name, email, zodiacSign } = req.body;

    if (!name || !email || !zodiacSign) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: name, email, zodiacSign' 
      });
    }

    console.log('🎯 Creating PayPal subscription for:', { name, email, zodiacSign });

    // Import PayPal functions
    const { createSubscriptionPlan, createSubscription, getCurrentPlan, getPayPalApiUrl } = await import('../src/lib/paypalService.js');
    
    // Get current plan (1¢ for testing)
    const currentPlan = getCurrentPlan();
    console.log('📋 Using plan:', currentPlan);

    // Step 1: Create subscription plan
    console.log('🏗️ Creating subscription plan...');
    const planResult = await createSubscriptionPlan(currentPlan);
    
    if (!planResult.success) {
      throw new Error('Failed to create subscription plan: ' + (planResult.error || 'Unknown error'));
    }

    console.log('✅ Plan created:', planResult.planId);

    // Step 2: Create subscription for user
    console.log('👤 Creating subscription for user...');
    const subscriptionResult = await createSubscription(planResult.planId, {
      name,
      email,
      zodiacSign
    });

    if (!subscriptionResult.success) {
      throw new Error('Failed to create subscription: ' + (subscriptionResult.error || 'Unknown error'));
    }

    console.log('✅ Subscription created:', subscriptionResult.subscriptionId);

    // Step 3: Save subscriber to our system (you can add this later)
    // const { addSubscriber } = await import('../src/lib/subscriptionManager.js');
    // const subscriber = addSubscriber({
    //   email,
    //   name,
    //   zodiacSign,
    //   paypalSubscriptionId: subscriptionResult.subscriptionId,
    //   status: 'pending', // Will be updated via webhook
    //   nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    // });

    return res.status(200).json({
      success: true,
      message: 'Subscription created successfully',
      data: {
        planId: planResult.planId,
        subscriptionId: subscriptionResult.subscriptionId,
        approvalUrl: subscriptionResult.approvalUrl,
        plan: currentPlan
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