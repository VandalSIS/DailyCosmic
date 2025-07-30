import React, { useState } from "react";

interface PayPalSubscriptionProps {
  name: string;
  email: string;
  zodiacSign: string;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ name, email, zodiacSign }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayPalClick = async () => {
    setIsProcessing(true);
    
    try {
      // Store subscriber info before redirecting to PayPal
      await fetch('/api/store-subscriber', {
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
      
            // Direct PayPal subscription link (SANDBOX MODE)  
      const paypalUrl = "https://www.sandbox.paypal.com/webapps/billing/plans/subscribe?plan_id=P-80H557B9K528905TNCEUL3Q";
      
      // Redirect to PayPal (same window for better UX)
      window.location.href = paypalUrl;
      
    } catch (error) {
      console.error('Error storing subscriber info:', error);
      setIsProcessing(false);
      // Still allow PayPal redirect even if storing fails
      const paypalUrl = "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-40N61099UW225793TNCE7N4I";
      window.location.href = paypalUrl;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handlePayPalClick}
        disabled={isProcessing}
        className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-300 text-black font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 7.27a.641.641 0 0 1 .633-.54h6.504c3.114 0 5.635 2.521 5.635 5.635 0 3.114-2.521 5.635-5.635 5.635H9.348l-.758 3.337zm7.086-9.337c0-2.206-1.789-3.995-3.995-3.995H6.577l-1.758 7.73h5.822c2.206 0 3.995-1.789 3.995-3.995z"/>
        </svg>
        {isProcessing ? 'Processing...' : 'Subscribe with PayPal - $9.99/month'}
      </button>
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>How it works:</strong>
        </p>
        <ol className="text-blue-700 text-xs mt-2 space-y-1">
          <li>1. Click the PayPal button above</li>
          <li>2. Complete your payment on PayPal</li>
          <li>3. Your PDF will be automatically sent to your email</li>
          <li>4. Check your inbox (and spam folder) within 5 minutes</li>
        </ol>
      </div>
      
      <p className="text-xs text-white/50 text-center mt-3">
        Secure payment processing through PayPal. PDF delivered automatically after payment confirmation.
      </p>
    </div>
  );
};

export default PayPalSubscription; 