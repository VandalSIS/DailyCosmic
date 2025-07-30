import React from "react";

interface PayPalSubscriptionProps {
  name: string;
  email: string;
  zodiacSign: string;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ name, email, zodiacSign }) => {
  const handlePayPalClick = () => {
    // Simple PayPal subscription URL
    const paypalUrl = `https://www.paypal.com/subscriptions/checkout?plan_id=P-40N61099UW225793TNCE7N4I`;
    
    // Open PayPal in new window
    const newWindow = window.open(paypalUrl, '_blank', 'width=600,height=700');
    
    // Check if window opened successfully
    if (newWindow) {
      // After 3 seconds, redirect to success (for testing)
      setTimeout(() => {
        window.location.href = `/subscription-success?subscription_id=test_${Date.now()}`;
      }, 3000);
    } else {
      // If popup blocked, redirect directly
      window.location.href = paypalUrl;
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
        Subscribe with PayPal - $0.01/month
      </button>
      
      <p className="text-xs text-white/50 text-center mt-3">
        Click to complete your subscription securely through PayPal
      </p>
    </div>
  );
};

export default PayPalSubscription; 