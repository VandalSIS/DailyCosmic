import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Mail, Crown, ArrowRight, XCircle, Loader2 } from "lucide-react";
import { CelestialBackground } from "@/components/CelestialBackground";
import { motion } from "framer-motion";
import { getSubscriberByPayPalId, updateSubscriberStatus } from "@/lib/subscriptionManager";
import { useToast } from "@/hooks/use-toast";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscriber, setSubscriber] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const subscriptionId = searchParams.get('subscription_id');
    const token = searchParams.get('token');
    
    if (subscriptionId) {
      // Find subscriber by PayPal subscription ID
      const foundSubscriber = getSubscriberByPayPalId(subscriptionId);
      if (foundSubscriber) {
        // Update subscriber status to active
        updateSubscriberStatus(foundSubscriber.id, 'active');
        setSubscriber(foundSubscriber);
        console.log('✅ Subscription activated:', foundSubscriber);
      }
    }
    
    setIsLoading(false);
  }, [searchParams]);

  const handleCancelSubscription = async () => {
    const subscriptionId = searchParams.get('subscription_id');
    if (!subscriptionId) {
      toast({
        title: "Error",
        description: "Subscription ID not found",
        variant: "destructive"
      });
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Success",
          description: "Your subscription has been cancelled",
        });
        // Update local subscriber status
        if (subscriber) {
          updateSubscriberStatus(subscriber.id, 'cancelled');
          setSubscriber({ ...subscriber, status: 'cancelled' });
        }
      } else {
        throw new Error(result.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive"
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CelestialBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border border-green-500/20 bg-black/60 backdrop-blur-xl">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <CheckCircle className="w-16 h-16 text-green-400 fill-current" />
                    <motion.div
                      className="absolute -top-2 -right-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <Crown className="w-6 h-6 text-yellow-400 fill-current" />
                    </motion.div>
                  </div>
                </div>
                
                <CardTitle className="text-2xl text-white mb-2">
                  🎉 Subscription Activated!
                </CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  Welcome to your monthly cosmic journey
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {subscriber && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h3 className="text-white font-semibold mb-2">Subscription Details</h3>
                    <div className="text-sm text-white/80 space-y-1">
                      <p><span className="text-violet-300">Name:</span> {subscriber.name}</p>
                      <p><span className="text-violet-300">Email:</span> {subscriber.email}</p>
                      <p><span className="text-violet-300">Zodiac Sign:</span> {subscriber.zodiacSign}</p>
                      <p><span className="text-violet-300">Next Horoscope:</span> 15th of next month</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-center">What happens next?</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-white/80">
                      <Calendar className="w-5 h-5 text-violet-300 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">Monthly Delivery</p>
                        <p>Your personalized horoscope will be delivered on the 15th of each month</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-sm text-white/80">
                      <Mail className="w-5 h-5 text-violet-300 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p>You'll receive an email with your high-quality PDF horoscope attached</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-sm text-white/80">
                      <Crown className="w-5 h-5 text-violet-300 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">Premium Content</p>
                        <p>Fresh insights based on current planetary movements and your zodiac sign</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 p-4 rounded-lg border border-violet-500/30">
                  <p className="text-white text-sm text-center">
                    🌟 <strong>Thank you for subscribing!</strong> Your first horoscope will arrive on the 15th of next month. You can manage your subscription anytime through PayPal.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => navigate('/')}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Back to Homepage
                  </Button>
                  
                  {subscriber?.status !== 'cancelled' ? (
                    <Button
                      variant="outline"
                      onClick={handleCancelSubscription}
                      disabled={isCancelling}
                      className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    >
                      {isCancelling ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel Subscription
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="flex-1 border-gray-500/20 text-gray-400"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Subscription Cancelled
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess; 