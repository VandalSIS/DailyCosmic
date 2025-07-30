import React, { useEffect } from "react";

const PayPalSubscription = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=ASmSlhvv_5Rie80Qt0OBS&vault=true";
    script.addEventListener("load", () => {
      // @ts-ignore
      window.paypal.Buttons({
        createSubscription: (data: any, actions: any) => {
          return actions.subscription.create({
            plan_id: "P-40N61099UW225793TNCE7N4I" // Corrected Plan ID
          });
        },
        onApprove: (data: any) => {
          console.log("Subscription created successfully:", data);
          window.location.href = `/subscription-success?subscription_id=${data.subscriptionID}`;
        },
        onError: (err: any) => {
          console.error("PayPal Error:", err);
          alert("There was an error processing your subscription. Please try again.");
        }
      }).render("#paypal-button-container");
    });
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div id="paypal-button-container" className="mt-4"></div>
    </div>
  );
};

export default PayPalSubscription; 