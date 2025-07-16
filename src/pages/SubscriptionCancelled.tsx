import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RotateCcw, HelpCircle } from "lucide-react";
import { CelestialBackground } from "@/components/CelestialBackground";
import { motion } from "framer-motion";

const SubscriptionCancelled = () => {
  const navigate = useNavigate();

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
            <Card className="border border-orange-500/20 bg-black/60 backdrop-blur-xl">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <XCircle className="w-16 h-16 text-orange-400" />
                </div>
                
                <CardTitle className="text-2xl text-white mb-2">
                  Subscription Cancelled
                </CardTitle>
                <CardDescription className="text-white/70 text-lg">
                  Your PayPal subscription was not completed
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                  <p className="text-white text-sm text-center">
                    Don't worry! No payment was processed. You can try again anytime.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-center">Why subscribe to monthly horoscopes?</h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-violet-300 font-medium text-sm">🌟 Fresh Content Monthly</p>
                      <p className="text-white/70 text-xs">New insights based on current cosmic events</p>
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-violet-300 font-medium text-sm">🎯 Personalized for You</p>
                      <p className="text-white/70 text-xs">Tailored specifically for your zodiac sign</p>
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-violet-300 font-medium text-sm">💰 Only 1¢ (Test Mode)</p>
                      <p className="text-white/70 text-xs">Currently in test mode - practically free!</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-medium text-center">Need help?</h4>
                  
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="space-y-2 text-sm text-white/80">
                      <p><span className="text-violet-300">✓</span> PayPal account required for subscription</p>
                      <p><span className="text-violet-300">✓</span> You can cancel anytime through PayPal</p>
                      <p><span className="text-violet-300">✓</span> No long-term commitment required</p>
                      <p><span className="text-violet-300">✓</span> Secure payment processing</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => navigate('/payment', { 
                      state: { 
                        formData: {
                          name: 'Previous User',
                          email: 'user@example.com',
                          zodiacSign: 'Aries ♈'
                        }
                      }
                    })}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="flex-1 border-violet-500/20 text-white hover:bg-violet-500/20"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Homepage
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('mailto:support@cosmicplanner.com', '_blank')}
                    className="text-white/60 hover:text-white/80"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancelled; 