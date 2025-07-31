import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Mail, CheckCircle, FileText, Gift, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CelestialBackground } from "@/components/CelestialBackground";
import { ZodiacSymbol3D } from "@/components/ZodiacSymbol3D";
import { motion } from "framer-motion";
import { zodiacPdfMapping } from "@/lib/zodiacPdfMapping";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    zodiacSign: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const zodiacSigns = [
    "Aries ♈", "Taurus ♉", "Gemini ♊", "Cancer ♋", "Leo ♌", "Virgo ♍",
    "Libra ♎", "Scorpio ♏", "Sagittarius ♐", "Capricorn ♑", "Aquarius ♒", "Pisces ♓"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendFreeCalendar = async () => {
    if (!formData.name || !formData.email || !formData.zodiacSign) {
      toast({
        title: "Please fill in required fields",
        description: "We need your name, email, and zodiac sign to send your free calendar.",
        variant: "destructive"
      });
      return;
    }

    // Send free zodiac calendar immediately
    try {
      const { mockPayment } = await import('@/lib/mockPayment');
      
      toast({
        title: "🌟 Sending your free calendar...",
        description: "Please wait while we prepare your personalized zodiac calendar.",
      });

      const result = await mockPayment.sendFreeCalendar(
        formData.email,
        formData.zodiacSign,
        formData.name
      );

      if (result.success && result.emailSent) {
        toast({
          title: "📧 Free Calendar Sent!",
          description: `Your ${result.pdfInfo?.displayName} has been sent to ${formData.email}. Please check your spam/junk folder if you don't see it in your inbox.`,
        });
      } else {
        toast({
          title: "⚠️ Email Issue",
          description: result.emailMessage || "There was an issue sending your calendar. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProceedToPayment = () => {
    if (!formData.name || !formData.email || !formData.birthDate || !formData.zodiacSign) {
      toast({
        title: "Please fill in all required fields",
        description: "We need your birth details to create your personalized calendar.",
        variant: "destructive"
      });
      return;
    }

    // Save user data to localStorage for success page
    localStorage.setItem('userName', formData.name);
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('userZodiac', formData.zodiacSign);

    // Redirect to PayPal payment
    const paypalUrl = "https://www.paypal.com/ncp/payment/4RUELC8L4ZX56";
    window.location.href = paypalUrl;
  };

  // Helper function to get zodiac sign key (without emoji)
  const getZodiacKey = (signWithEmoji: string) => {
    return signWithEmoji.split(' ')[0].toLowerCase();
  };

  // Helper function to get PDF info
  const getPdfInfo = (zodiacSign: string) => {
    const key = getZodiacKey(zodiacSign);
    return zodiacPdfMapping[key];
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
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Star className="w-8 h-8 text-violet-300 fill-current" />
              Cosmic Daily Planner
            </h1>
            <p className="text-lg text-white/70">
              Get your FREE personalized zodiac calendar delivered instantly to your email
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border border-violet-500/20 bg-black/60 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-300" />
                    Your Birth Information
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Please provide your birth details for accurate predictions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-black/30 border-violet-500/20 text-white placeholder:text-white/50 focus:border-violet-400"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-black/30 border-violet-500/20 text-white placeholder:text-white/50 focus:border-violet-400"
                        placeholder="your@email.com"
                      />
                    <p className="text-sm text-white/50 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Your calendar will be sent to this email (check spam folder if needed)
                      </p>
                    </div>

                      <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-white">
                          Birth Date (optional)
                        </Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => handleInputChange("birthDate", e.target.value)}
                      className="bg-black/30 border-violet-500/20 text-white focus:border-violet-400"
                        />
                      </div>

                      <div className="space-y-2">
                    <Label htmlFor="zodiacSign" className="text-white">
                        Zodiac Sign *
                      </Label>
                      <Select value={formData.zodiacSign} onValueChange={(value) => handleInputChange("zodiacSign", value)}>
                      <SelectTrigger className="bg-black/30 border-violet-500/20 text-white">
                          <SelectValue placeholder="Select your zodiac sign" />
                        </SelectTrigger>
                      <SelectContent className="bg-black/95 border-violet-500/20">
                          {zodiacSigns.map((sign) => (
                          <SelectItem 
                            key={sign} 
                            value={sign}
                            className="text-white hover:bg-violet-500/20 focus:bg-violet-500/20"
                          >
                              {sign}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border border-violet-500/20 bg-black/60 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-violet-300" />
                    Your Cosmic Calendar Preview
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Here's what you'll receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.zodiacSign && (
                    <div className="text-center">
                      <ZodiacSymbol3D sign={formData.zodiacSign} />
                      <h3 className="text-lg font-semibold text-white mt-4">
                        {getPdfInfo(formData.zodiacSign)?.displayName || `${formData.zodiacSign} Daily Planner`}
                      </h3>
                      <p className="text-white/70 text-sm">
                        Personalized daily guidance for {formData.zodiacSign}
                      </p>
                      </div>
                    )}

                    <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-white/80">
                      <Star className="w-4 h-4 text-violet-300 mt-0.5 flex-shrink-0" />
                      <span>Monthly personalized horoscope guidance</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-white/80">
                      <Calendar className="w-4 h-4 text-violet-300 mt-0.5 flex-shrink-0" />
                      <span>Monthly insights based on your zodiac sign</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-white/80">
                      <Gift className="w-4 h-4 text-violet-300 mt-0.5 flex-shrink-0" />
                      <span>High-resolution PDF ready for printing</span>
                  </div>
                    <div className="flex items-start gap-3 text-sm text-white/80">
                      <Mail className="w-4 h-4 text-violet-300 mt-0.5 flex-shrink-0" />
                      <span>Instant delivery to your email</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              onClick={handleSendFreeCalendar}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-xl transform transition-all duration-200 hover:scale-105"
              size="lg"
            >
              <Gift className="w-5 h-5 mr-2" />
              Get FREE Calendar Now
            </Button>

            <Button
              onClick={handleProceedToPayment}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black px-8 py-6 text-lg font-semibold rounded-xl shadow-xl transform transition-all duration-200 hover:scale-105"
              size="lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pay €9.99 - Get Horoscope
            </Button>
          </motion.div>

          {/* Features Grid */}
                <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-violet-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Personalized</h3>
                <p className="text-white/70 text-sm">
                  Tailored specifically for your zodiac sign with accurate daily predictions
                </p>
              </CardContent>
            </Card>

            <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-violet-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Monthly Guidance</h3>
                <p className="text-white/70 text-sm">
                  Monthly cosmic insights to help you make the right decisions
                </p>
              </CardContent>
            </Card>

            <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-xl">
              <CardContent className="p-6 text-center">
                <Mail className="w-12 h-12 text-violet-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Instant Delivery</h3>
                <p className="text-white/70 text-sm">
                  Get your calendar delivered directly to your email in seconds
                </p>
                  </CardContent>
                </Card>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-3">
                    "This calendar has completely transformed how I plan my days. The cosmic insights are incredibly accurate!"
                  </p>
                  <p className="text-violet-300 text-sm">- Sarah M., Leo ♌</p>
                </CardContent>
              </Card>

              <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-3">
                    "I love how personalized this is. Every day feels more aligned with the universe now."
                  </p>
                  <p className="text-violet-300 text-sm">- Michael R., Scorpio ♏</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
                  </h2>
            <div className="space-y-4">
              <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Is the calendar really free?
                  </h3>
                  <p className="text-white/70">
                    Yes! We're offering completely free personalized zodiac calendars. No hidden fees, no credit card required.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    How quickly will I receive my calendar?
                  </h3>
                  <p className="text-white/70">
                    Your personalized calendar will be sent to your email within seconds of submitting your information.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    What format is the calendar in?
                  </h3>
                  <p className="text-white/70">
                    You'll receive a high-quality PDF that you can view on any device or print at home.
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

export default Index;
