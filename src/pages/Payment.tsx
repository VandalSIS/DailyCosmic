import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CelestialBackground } from "@/components/CelestialBackground";
import { ZodiacSymbol3D } from "@/components/ZodiacSymbol3D";
import { motion } from "framer-motion";
import { mockPayment } from "@/lib/mockPayment";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const formData = location.state?.formData;

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>No form data found. Please fill out the form first.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')}>Return to Form</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const result = await mockPayment.processPayment(
        "29.99",
        formData.email,
        formData.zodiacSign,
        formData.name
      );

      if (result.success) {
        toast({
          title: "✨ Payment Successful!",
          description: `Order ${result.orderId} processed successfully.`,
        });

        if (result.emailSent && result.pdfInfo) {
          toast({
            title: "📧 Email Sent!",
            description: `Your ${result.pdfInfo.displayName} has been sent to ${formData.email}`,
          });
        } else {
          toast({
            title: "⚠️ Email Issue",
            description: result.emailMessage || "There was an issue sending your PDF. Please contact support.",
            variant: "destructive",
          });
        }

        navigate('/', { state: { paymentSuccess: true } });
      } else {
        throw new Error("Payment processing failed");
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CelestialBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div 
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-white fill-current" />
              <h1 className="text-2xl font-bold text-white">Secure Checkout</h1>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
                <CardDescription className="text-white/70">Review your details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <h3 className="font-semibold text-white">Personalized Astrology Calendar</h3>
                    <p className="text-sm text-white/70">365 days of cosmic guidance</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/10 text-white">Digital Product</Badge>
                </div>
                
                <div className="flex items-center justify-center py-6">
                  <ZodiacSymbol3D sign={formData.zodiacSign} isSelected={true} />
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-medium text-white mb-2">Your Details:</h4>
                  <div className="text-sm text-white/70 space-y-1">
                    <p><span className="font-medium">Name:</span> {formData.name}</p>
                    <p><span className="font-medium">Email:</span> {formData.email}</p>
                    <p><span className="font-medium">Birth Date:</span> {formData.birthDate}</p>
                    <p><span className="font-medium">Zodiac Sign:</span> {formData.zodiacSign}</p>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold text-white">
                    <span>Total:</span>
                    <span className="text-purple-300">$29.99</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-purple-300" />
                  Payment
                </CardTitle>
                <CardDescription className="text-white/70">
                  Development Mode: Simulated Payment System
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-none"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Complete Purchase - $29.99'
                  )}
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Development Mode - No actual payment will be processed</span>
                </div>

                <div className="bg-white/5 p-4 rounded-lg text-sm text-white/70 border border-white/10">
                  <p className="font-medium mb-2 text-white">Development Notes:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>This is a simulated payment system</li>
                    <li>Payment integration will be added later</li>
                    <li>Email delivery is currently mocked</li>
                    <li>Data storage will be implemented with production</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
