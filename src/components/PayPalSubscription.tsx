import React, { useState } from "react";

interface PayPalSubscriptionProps {
  name: string;
  email: string;
  zodiacSign: string;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ name, email, zodiacSign }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSendingPdf, setIsSendingPdf] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handlePayPalClick = () => {
    // Direct PayPal subscription link from the copy link option
    const paypalUrl = "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-40N61099UW225793TNCE7N4I";
    
    // Open PayPal in new window
    window.open(paypalUrl, '_blank');
    
    // Show confirmation button after PayPal opens
    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    setIsSendingPdf(true);
    setDebugInfo('Starting PDF send...');
    
    try {
      // First test the API
      setDebugInfo('Testing API...');
      const testResponse = await fetch('/api/test-pdf-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          zodiacSign
        })
      });

      const testResult = await testResponse.json();
      setDebugInfo(`Test result: ${JSON.stringify(testResult)}`);

      if (!testResult.success) {
        throw new Error('Test API failed');
      }

      // Now try the real API
      setDebugInfo('Calling real API...');
      const response = await fetch('/api/create-paypal-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          zodiacSign,
          subscriptionId: `paypal_${Date.now()}`
        })
      });

      const result = await response.json();
      setDebugInfo(`Real API result: ${JSON.stringify(result)}`);
      
      if (response.ok) {
        // Redirect to success page
        window.location.href = `/subscription-success?subscription_id=paypal_${Date.now()}`;
      } else {
        throw new Error(`API failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending PDF:', error);
      setDebugInfo(`Error: ${error.message}`);
      alert(`Error sending PDF: ${error.message}`);
      setIsSendingPdf(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handlePayPalClick}
        className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 7.27a.641.641 0 0 1 .633-.54h6.504c3.114 0 5.635 2.521 5.635 5.635 0 3.114-2.521 5.635-5.635 5.635H9.348l-.758 3.337zm7.086-9.337c0-2.206-1.789-3.995-3.995-3.995H6.577l-1.758 7.73h5.822c2.206 0 3.995-1.789 3.995-3.995z"/>
        </svg>
        Subscribe with PayPal - $9.99/month
      </button>
      
      {showConfirmation && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
          <p className="text-green-800 mb-3">
            <strong>Payment completed?</strong> Click below to receive your PDF:
          </p>
          <button
            onClick={handleConfirmPayment}
            disabled={isSendingPdf}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded font-semibold"
          >
            {isSendingPdf ? 'Sending PDF...' : '✅ Confirm Payment & Send PDF'}
          </button>
          
          {debugInfo && (
            <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
              <strong>Debug:</strong> {debugInfo}
            </div>
          )}
        </div>
      )}
      
      <p className="text-xs text-white/50 text-center mt-3">
        Click to complete your subscription securely through PayPal
      </p>
    </div>
  );
};

export default PayPalSubscription; 