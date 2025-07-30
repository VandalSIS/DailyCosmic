import React, { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

interface PayPalSubscriptionProps {
  name: string;
  email: string;
  zodiacSign: string;
}

const PayPalSubscription: React.FC<PayPalSubscriptionProps> = ({ name, email, zodiacSign }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const renderPayPalButton = useCallback((container: HTMLDivElement) => {
    if (!container || !(window as any).paypal) {
      return;
    }

    console.log("Rendering PayPal button...");
    
    // @ts-ignore
    (window as any).paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'subscribe'
      },
      createSubscription: (data: any, actions: any) => {
        console.log("Creating subscription...");
        return actions.subscription.create({
          plan_id: "P-40N61099UW225793TNCE7N4I"
        });
      },
      onApprove: (data: any) => {
        console.log("Subscription approved:", data);
        alert("Subscription created! ID: " + data.subscriptionID);
        window.location.href = `/subscription-success?subscription_id=${data.subscriptionID}`;
      },
      onError: (err: any) => {
        console.error("PayPal Error:", err);
        setError("PayPal error: " + err.message);
      }
    }).render(container)
      .then(() => {
        console.log("PayPal button rendered successfully");
        setIsLoading(false);
      })
      .catch((err: any) => {
        console.error("PayPal render error:", err);
        setError("Failed to render PayPal button: " + err.message);
        setIsLoading(false);
      });
  }, []);

  const containerRef = useCallback((container: HTMLDivElement | null) => {
    if (container && paypalLoaded) {
      renderPayPalButton(container);
    }
  }, [paypalLoaded, renderPayPalButton]);

  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if PayPal script is already loaded
        if ((window as any).paypal) {
          console.log("PayPal already loaded");
          setPaypalLoaded(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=ARomUkFNIwXiH39_TQWlup7WueGqDRdJJ7htrMnqJ52fYYm_GG1MLP1YnbBH1ubgNnXNWV8tPJ2OwByk&vault=true&intent=subscription";
        script.async = true;
        
        script.onload = () => {
          console.log("PayPal script loaded successfully");
          setPaypalLoaded(true);
        };

        script.onerror = () => {
          console.error("PayPal script failed to load");
          setError("Failed to load PayPal script. Please check your internet connection.");
          setIsLoading(false);
        };

        document.body.appendChild(script);

      } catch (err) {
        console.error("PayPal initialization error:", err);
        setError("Failed to initialize PayPal: " + (err as Error).message);
        setIsLoading(false);
      }
    };

    loadPayPalScript();
  }, []);

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
      <div ref={containerRef} className="mt-4"></div>
    </div>
  );
};

export default PayPalSubscription; 