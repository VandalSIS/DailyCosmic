import React from "react";

interface PayPalSubscriptionProps {
  name: string;
  email: string;
  zodiacSign: string;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ name, email, zodiacSign }) => {
  const handlePayPalClick = () => {
    // Direct PayPal subscription link from the copy link option
    const paypalUrl = "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-40N61099UW225793TNCE7N4I";
    
    // Open PayPal in new window
    const newWindow = window.open(paypalUrl, '_blank');
    
    // After payment, call our API to send PDF
    const checkPayment = setInterval(() => {
      if (newWindow && newWindow.closed) {
        clearInterval(checkPayment);
        
        // PayPal window closed, assume payment completed
        // Call our API to send welcome PDF
        fetch('/api/create-paypal-subscription', {
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
        }).then(() => {
          // Redirect to success page
          window.location.href = `/subscription-success?subscription_id=paypal_${Date.now()}`;
        }).catch(() => {
          // Still redirect even if API fails
          window.location.href = `/subscription-success?subscription_id=paypal_${Date.now()}`;
        });
      }
    }, 1000);
    
    // Fallback: if window doesn't close within 5 minutes, assume payment completed
    setTimeout(() => {
      clearInterval(checkPayment);
      if (newWindow && !newWindow.closed) {
        newWindow.close();
      }
      
      // Call API to send PDF
      fetch('/api/create-paypal-subscription', {
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
      }).then(() => {
        window.location.href = `/subscription-success?subscription_id=paypal_${Date.now()}`;
      }).catch(() => {
        window.location.href = `/subscription-success?subscription_id=paypal_${Date.now()}`;
      });
    }, 300000); // 5 minutes
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
      
      <p className="text-xs text-white/50 text-center mt-3">
        Click to complete your subscription securely through PayPal
      </p>
    </div>
  );
};

export default PayPalSubscription; 