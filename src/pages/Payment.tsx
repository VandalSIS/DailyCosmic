import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, Shield, Loader2, Crown, Calendar, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CelestialBackground } from "@/components/CelestialBackground";
import { ZodiacSymbol3D } from "@/components/ZodiacSymbol3D";
import { motion } from "framer-motion";
// PayPal operations now handled server-side via API endpoints

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const formData = location.state?.formData;
  
  // Test plan details (moved from server-side)
  const testPlan = {
    price: '0.01',
    currency: 'USD',
    name: 'Cosmic Horoscope Monthly - Test',
    description: 'Monthly personalized horoscope delivery (Test version)'
  };

  if (!formData) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <CelestialBackground />
        <div className="container mx-auto px-4 py-8 relative z-20 flex items-center justify-center min-h-screen">
          <Card className="w-96 border border-violet-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Error</CardTitle>
              <CardDescription className="text-white/70">No form data found. Please fill out the form first.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/')} className="w-full">Return to Form</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSubscription = async () => {
    setIsProcessing(true);
    try {
      console.log('🚀 Creating PayPal subscription via API...');
      
      // Call server-side API to create subscription
      const response = await fetch('/api/create-paypal-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          zodiacSign: formData.zodiacSign
        })
      });

      const result = await response.json();

      if (result.success && result.data.approvalUrl) {
        console.log('✅ Subscription created:', result.data.subscriptionId);
        
        // Redirect to PayPal for approval
        window.location.href = result.data.approvalUrl;
      } else {
        throw new Error(result.error || 'Failed to create subscription');
      }

    } catch (error) {
      console.error('Subscription creation error:', error);
      toast({
        title: "❌ Subscription Failed",
        description: error.message || "Failed to create subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToForm = () => {
    navigate('/', { state: { formData } });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CelestialBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="outline"
              onClick={handleBackToForm}
              className="mb-6 border-violet-500/20 text-white hover:bg-violet-500/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
            
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Crown className="w-8 h-8 text-yellow-400 fill-current" />
              Monthly Horoscope Subscription
            </h1>
            <p className="text-lg text-white/70">
              Get fresh horoscope insights delivered monthly
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border border-violet-500/20 bg-black/60 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-violet-300" />
                    Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-white/70">Name</label>
                    <p className="text-white font-semibold">{formData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-white/70">Email</label>
                    <p className="text-white font-semibold">{formData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-white/70">Zodiac Sign</label>
                    <p className="text-white font-semibold">{formData.zodiacSign}</p>
                  </div>
                  
                  <div className="text-center pt-4">
                    <ZodiacSymbol3D sign={formData.zodiacSign} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscription Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border border-violet-500/20 bg-black/60 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    Subscription Details
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {testPlan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      ${testPlan.price}
                      <span className="text-lg text-white/70 font-normal">/month</span>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/20">
                      {testPlan.price === '0.01' ? 'Test Mode - 1¢' : 'Production'}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-white/80">
                      <Calendar className="w-4 h-4 text-violet-300 mt-0.5 flex-shrink-0" />
                      <span>Fresh horoscope PDF delivered monthly on the 15th</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-white/80">
                      <Mail className="w-4 h-4 text-violet-300 mt-0.5 flex-shrink-0" />
                      <span>Personalized insights for {formData.zodiacSign}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-white/80">
                      <Shield className="w-4 h-4 text-violet-300 mt-0.5 flex-shrink-0" />
                      <span>Cancel anytime through PayPal</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-white/80">
                      <Crown className="w-4 h-4 text-violet-300 mt-0.5 flex-shrink-0" />
                      <span>High-quality PDF ready for printing</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleSubscription}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Subscription...
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Subscribe with PayPal
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-white/50 text-center mt-3">
                      You'll be redirected to PayPal to complete your subscription.
                      {testPlan.price === '0.01' && ' This is test mode - you will only be charged 1¢.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Benefits Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Why Subscribe to Monthly Horoscopes?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-xl">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-violet-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Fresh Content</h3>
                  <p className="text-white/70 text-sm">
                    New horoscope insights every month, tailored to cosmic events
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-xl">
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 text-violet-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Personalized</h3>
                  <p className="text-white/70 text-sm">
                    Specific guidance for your zodiac sign and current planetary movements
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-xl">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-violet-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Reliable</h3>
                  <p className="text-white/70 text-sm">
                    Automatic delivery on the 15th of each month, cancel anytime
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
