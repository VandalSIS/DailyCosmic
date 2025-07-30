import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface PayPalSubscriptionProps {
  name: string;
  email: string;
  zodiacSign: string;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ name, email, zodiacSign }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayPal = () => {
      // Check if PayPal is already loaded
      if ((window as any).paypal) {
        renderPayPalButton();
        return;
      }

      // Load PayPal script
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=ARomUkFNIwXiH39_TQWlup7WueGqDRdJJ7htrMnqJ52fYYm_GG1MLP1YnbBH1ubgNnXNWV8tPJ2OwByk&vault=true&intent=subscription";
      script.async = true;
      
      script.onload = () => {
        console.log("PayPal loaded successfully");
        renderPayPalButton();
      };
      
      script.onerror = () => {
        setError("Failed to load PayPal");
        setIsLoading(false);
      };
      
      document.body.appendChild(script);
    };

    const renderPayPalButton = () => {
      const container = document.getElementById("paypal-button-container");
      if (!container) {
        setError("PayPal container not found");
        setIsLoading(false);
        return;
      }

      // @ts-ignore
      (window as any).paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: (data: any, actions: any) => {
          return actions.subscription.create({
            plan_id: "P-40N61099UW225793TNCE7N4I"
          });
        },
        onApprove: (data: any) => {
          console.log("Subscription approved:", data);
          // Create subscription record
          fetch('/api/create-paypal-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              email,
              zodiacSign,
              subscriptionId: data.subscriptionID
            })
          }).then(() => {
            window.location.href = `/subscription-success?subscription_id=${data.subscriptionID}`;
          }).catch(() => {
            window.location.href = `/subscription-success?subscription_id=${data.subscriptionID}`;
          });
        },
        onError: (err: any) => {
          console.error("PayPal Error:", err);
          setError("PayPal error: " + err.message);
        }
      }).render(container)
        .then(() => {
          setIsLoading(false);
        })
        .catch((err: any) => {
          console.error("Render error:", err);
          setError("Failed to render PayPal button");
          setIsLoading(false);
        });
    };

    loadPayPal();
  }, [name, email, zodiacSign]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        <span className="ml-2 text-white">Loading PayPal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="paypal-button-container" className="mt-4"></div>
    </div>
  );
};

export default PayPalSubscription; 