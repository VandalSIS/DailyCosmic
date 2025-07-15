export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Test calendar API called');
    
    // Test data
    const testData = {
      email: req.query?.email || req.body?.email || 'test@example.com',
      zodiacSign: 'Aries ♈',
      name: 'Test User'
    };

    console.log('Testing with data:', testData);

    // Call the main send-calendar function
    const calendarResponse = await fetch('https://cadalunastro.com/api/send-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await calendarResponse.json();
    
    console.log('Calendar API response:', result);
    console.log('Status:', calendarResponse.status);

    return res.status(200).json({
      success: true,
      message: 'Test calendar function called',
      testData: testData,
      calendarApiStatus: calendarResponse.status,
      calendarApiResponse: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test calendar error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    });
  }
} 