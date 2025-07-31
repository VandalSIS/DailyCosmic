import React, { useState } from "react";

interface PayPalSubscriptionProps {
  name: string;
  email: string;
  zodiacSign: string;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ name, email, zodiacSign }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfSent, setPdfSent] = useState(false);

  const handlePayPalClick = async () => {
    setIsProcessing(true);
    
    try {
      // Send email first
      const response = await fetch('https://www.cadalunastro.com/api/send-horoscope', {
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

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Show success message
      setPdfSent(true);
      
      // Wait 2 seconds then redirect to PayPal
      setTimeout(() => {
        const paypalUrl = "https://www.sandbox.paypal.com/webapps/billing/plans/subscribe?plan_id=P-80H55782K3289051ENCEUL3Q";
        window.location.href = paypalUrl;
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
      setIsProcessing(false);
    }
  };

  if (pdfSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="p-4 bg-green-100 border border-green-400 rounded-lg">
          <h3 className="text-green-800 font-semibold">✅ Email Sent Successfully!</h3>
          <p className="text-green-700 text-sm mt-2">
            Check your email: <strong>{email}</strong>
          </p>
          <p className="text-green-600 text-xs mt-1">
            Redirecting to PayPal for subscription...
          </p>
        </div>
      </div>
    );
  }

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
        {isProcessing ? 'Sending PDF...' : '🎯 Get PDF + Subscribe ($0.01)'}
      </button>
      
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm font-semibold">
          🚀 SIMPLE APPROACH:
        </p>
        <ol className="text-red-700 text-xs mt-2 space-y-1">
          <li>1. Click button → PDF sent IMMEDIATELY to your email</li>
          <li>2. Then redirected to PayPal for subscription</li>
          <li>3. NO WAITING, NO WEBHOOKS, JUST WORKS!</li>
        </ol>
      </div>
      
      <p className="text-xs text-white/50 text-center mt-3">
        Email: {email} | Zodiac: {zodiacSign}
      </p>
    </div>
  );
};

export default PayPalSubscription;