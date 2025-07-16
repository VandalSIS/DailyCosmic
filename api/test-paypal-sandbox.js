export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🧪 Testing PayPal Sandbox Integration...');

    // Import PayPal functions
    const { createSubscriptionPlan, getCurrentPlan, getPayPalApiUrl } = await import('../src/lib/paypalService.js');
    
    const results = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        paypalEnv: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
        hasClientId: !!process.env.PAYPAL_CLIENT_ID,
        hasClientSecret: !!process.env.PAYPAL_CLIENT_SECRET,
        clientIdLength: process.env.PAYPAL_CLIENT_ID?.length || 0,
        secretLength: process.env.PAYPAL_CLIENT_SECRET?.length || 0
      },
      apiUrl: getPayPalApiUrl(),
      currentPlan: getCurrentPlan(),
      tests: {}
    };

    console.log('Environment check:', results.environment);

    // Test 1: Check credentials
    console.log('Test 1: Checking credentials...');
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      results.tests.credentials = {
        success: false,
        error: 'PayPal credentials not found in environment variables'
      };
      
      return res.status(200).json({
        success: false,
        message: 'PayPal credentials missing',
        results
      });
    }

    results.tests.credentials = {
      success: true,
      message: 'PayPal credentials found'
    };

    // Test 2: Get PayPal Access Token
    console.log('Test 2: Getting PayPal access token...');
    
    const apiUrl = getPayPalApiUrl();
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    try {
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
        console.error('Token request failed:', errorText);
        
        results.tests.accessToken = {
          success: false,
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorText
        };
      } else {
        const tokenData = await tokenResponse.json();
        console.log('✅ Access token obtained successfully');
        
        results.tests.accessToken = {
          success: true,
          tokenType: tokenData.token_type,
          expiresIn: tokenData.expires_in,
          hasAccessToken: !!tokenData.access_token
        };

        // Test 3: Create a test subscription plan
        console.log('Test 3: Creating test subscription plan...');
        
        try {
          const planResult = await createSubscriptionPlan(getCurrentPlan());
          
          results.tests.subscriptionPlan = {
            success: planResult.success,
            planId: planResult.planId,
            productId: planResult.productId
          };
          
          console.log('✅ Subscription plan created successfully:', planResult.planId);
          
        } catch (planError) {
          console.error('Plan creation failed:', planError);
          results.tests.subscriptionPlan = {
            success: false,
            error: planError.message
          };
        }
      }
    } catch (tokenError) {
      console.error('Token request error:', tokenError);
      results.tests.accessToken = {
        success: false,
        error: tokenError.message
      };
    }

    // Summary
    const allTestsPassed = Object.values(results.tests).every(test => test.success);
    
    return res.status(200).json({
      success: allTestsPassed,
      message: allTestsPassed 
        ? '✅ All PayPal Sandbox tests passed!' 
        : '❌ Some PayPal tests failed',
      results,
      nextSteps: allTestsPassed 
        ? [
            '1. PayPal Sandbox integration is working!',
            '2. You can now test the full subscription flow',
            '3. Fill out the form and click "Monthly Subscribe"',
            '4. Use PayPal sandbox test accounts to complete payment'
          ]
        : [
            '1. Check PayPal credentials in environment variables',
            '2. Verify sandbox app is properly configured',
            '3. Check PayPal Developer Dashboard for issues'
          ]
    });

  } catch (error) {
    console.error('PayPal sandbox test error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    });
  }
} 