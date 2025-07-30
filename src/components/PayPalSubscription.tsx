import React from "react";

interface PayPalSubscriptionProps {
  name: string;
  email: string;
  zodiacSign: string;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ name, email, zodiacSign }) => {
  const handlePayPalClick = () => {
    // Create a simple PayPal subscription URL
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=P-40N61099UW225793TNCE7N4I`;
    
    // Open PayPal in a new window
    window.open(paypalUrl, '_blank');
    
    // After a delay, redirect to success page (for testing)
    setTimeout(() => {
      window.location.href = `/subscription-success?subscription_id=test_${Date.now()}`;
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handlePayPalClick}
        className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.067 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H5.777c-.681 0-1.352-.163-1.844-.478C3.441 11.621 3.089 11.111 3.089 10.458c0-.653.352-1.163.844-1.478.492-.315 1.163-.478 1.844-.478h12.446c.681 0 1.352.163 1.844.478z"/>
        </svg>
        Subscribe with PayPal
      </button>
      
      <p className="text-xs text-white/50 text-center mt-3">
        Click to complete your subscription securely through PayPal
      </p>
    </div>
  );
};

export default PayPalSubscription; 