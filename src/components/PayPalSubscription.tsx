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
    const loadPayPalScript = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=ASmSlhvv_5Rie80Qt0OBS&vault=true&intent=subscription";
        script.async = true;
        
        script.onload = () => {
          setIsLoading(false);
          // @ts-ignore
          window.paypal.Buttons({
            createSubscription: async (data: any, actions: any) => {
              try {
                // Create PayPal subscription
                return actions.subscription.create({
                  plan_id: "P-40N61099UW225793TNCE7N4I"
                });
              } catch (err) {
                console.error("PayPal subscription creation error:", err);
                setError("Failed to create subscription. Please try again.");
                throw err;
              }
            },
            onApprove: async (data: any) => {
              console.log("Subscription approved:", data);
              try {
                // Create our subscription record
                const response = await fetch('/api/create-paypal-subscription', {
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
                });

                if (!response.ok) {
                  throw new Error('Failed to record subscription');
                }

                window.location.href = `/subscription-success?subscription_id=${data.subscriptionID}`;
              } catch (err) {
                console.error("Error recording subscription:", err);
                setError("Subscription approved but failed to record. Please contact support.");
              }
            },
            onError: (err: any) => {
              console.error("PayPal Error:", err);
              setError("There was an error processing your subscription. Please try again.");
            }
          }).render("#paypal-button-container")
            .catch((err: any) => {
              console.error("PayPal render error:", err);
              setError("Failed to load PayPal button. Please refresh the page.");
            });
        };

        script.onerror = () => {
          setError("Failed to load PayPal. Please check your internet connection and try again.");
          setIsLoading(false);
        };

        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      } catch (err) {
        console.error("PayPal script loading error:", err);
        setError("Failed to initialize PayPal. Please try again.");
        setIsLoading(false);
      }
    };

    loadPayPalScript();
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
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-violet-500 hover:text-violet-400"
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