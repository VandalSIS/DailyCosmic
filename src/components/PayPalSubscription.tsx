import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface PayPalSubscriptionProps {
  name: string;
  email: string;
  zodiacSign: string;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ name, email, zodiacSign }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTestSubscription = async () => {
    setIsProcessing(true);
    
    // Simulate PayPal processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create subscription record
    try {
      await fetch('/api/create-paypal-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          zodiacSign,
          subscriptionId: `test_${Date.now()}`
        })
      });
    } catch (error) {
      console.log('API call failed, continuing anyway');
    }
    
    // Redirect to success page
    window.location.href = `/subscription-success?subscription_id=test_${Date.now()}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handleTestSubscription}
        disabled={isProcessing}
        className="w-full px-6 py-4 bg-green-500 hover:bg-green-400 disabled:bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Test Subscription...
          </>
        ) : (
          <>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Test Subscription - $0.01/month
          </>
        )}
      </button>
      
      <p className="text-xs text-white/50 text-center mt-3">
        TEST MODE: This simulates a PayPal subscription for testing purposes
      </p>
    </div>
  );
};

export default PayPalSubscription; 