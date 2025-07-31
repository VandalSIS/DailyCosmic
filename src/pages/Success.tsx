import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail } from 'lucide-react';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [isSending, setIsSending] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user data from URL params or localStorage
    const name = searchParams.get('name') || localStorage.getItem('userName');
    const email = searchParams.get('email') || localStorage.getItem('userEmail');
    const zodiacSign = searchParams.get('zodiac') || localStorage.getItem('userZodiac');

    if (name && email && zodiacSign) {
      sendPdf(name, email, zodiacSign);
    } else {
      setError('Missing user information');
      setIsSending(false);
    }
  }, [searchParams]);

  const sendPdf = async (name: string, email: string, zodiacSign: string) => {
    try {
      const response = await fetch('/api/send-calendar', {
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

      if (response.ok) {
        setEmailSent(true);
        console.log('PDF sent successfully to:', email);
      } else {
        setError('Failed to send PDF');
      }
    } catch (error) {
      console.error('Error sending PDF:', error);
      setError('Failed to send PDF');
    } finally {
      setIsSending(false);
    }
  };

  if (isSending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Processing Your Payment...</h2>
          <p className="text-gray-300">Preparing your personalized horoscope</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <div className="bg-red-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center text-white p-8"
      >
        <div className="bg-green-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 mr-2" />
            <span className="font-semibold">PDF Sent Successfully!</span>
          </div>
          <p className="text-gray-300 mb-4">
            Your personalized horoscope has been sent to your email address.
            Please check your inbox (and spam folder).
          </p>
                     <div className="bg-blue-500/20 rounded-lg p-3">
             <p className="text-sm">
               <strong>What you received:</strong><br/>
               • Personalized monthly horoscope<br/>
               • Complete cosmic guidance<br/>
               • High-quality PDF format
             </p>
           </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Get Another Horoscope
          </button>
          
          <p className="text-xs text-gray-400">
            Thank you for choosing Cosmic Daily Planner! 🌟
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Success; 