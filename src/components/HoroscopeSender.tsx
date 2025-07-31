import React, { useState } from "react";
import { Resend } from 'resend';

interface HoroscopeSenderProps {
  name: string;
  email: string;
  zodiacSign: string;
}

const HoroscopeSender: React.FC<HoroscopeSenderProps> = ({ name, email, zodiacSign }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfSent, setPdfSent] = useState(false);

  const handleSendHoroscope = async () => {
    setIsProcessing(true);
    
    try {
      // Initialize Resend
      const resend = new Resend('re_U1nMQLbj_S2H4dx1owu1KQCNFKQG2XACF');

      // Send email directly
      const emailData = await resend.emails.send({
        from: 'noreply@cadalunastro.com',
        to: email,
        subject: `🌟 Your ${zodiacSign} Horoscope - Personal Reading`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6366f1;">🌟 Your Personal ${zodiacSign} Reading 🌟</h1>
            
            <p>Dear ${name},</p>
            
            <p>Thank you for choosing Cosmic Calendar! Here is your personalized horoscope reading.</p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h2>✨ Your ${zodiacSign} Insights:</h2>
              <p>The stars have aligned to reveal your path forward. This reading is specifically crafted for you.</p>
              
              <h3>🌠 Key Areas of Focus:</h3>
              <ul style="list-style: none; padding: 0;">
                <li>💫 <strong>Career:</strong> Major opportunities ahead! Your professional life takes an exciting turn.</li>
                <li>❤️ <strong>Love:</strong> Deep connections form. Express your feelings openly.</li>
                <li>🧘‍♀️ <strong>Health:</strong> Focus on rest and rejuvenation. Try meditation.</li>
                <li>💰 <strong>Money:</strong> Financial prospects improve. Smart investments pay off.</li>
              </ul>

              <div style="margin-top: 20px;">
                <p><strong>🎯 Lucky Days:</strong> 15th, 22nd, 28th</p>
                <p><strong>🎨 Power Colors:</strong> Blue, Silver, Purple</p>
                <p><strong>💎 Crystal Guide:</strong> Amethyst - For clarity and peace</p>
              </div>
            </div>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <h3 style="color: #4b5563;">🌙 Monthly Affirmation</h3>
              <p style="font-style: italic;">"I am aligned with the cosmic energy. Success and happiness flow naturally to me."</p>
            </div>

            <p style="margin-top: 20px;">May the stars light your path!</p>
            <p>Best wishes,<br>The Cosmic Calendar Team</p>
          </div>
        `
      });

      console.log('Email sent successfully:', emailData);
      setPdfSent(true);
      alert('✨ Success! Check your email for your personal reading!');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (pdfSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="p-4 bg-green-100 border border-green-400 rounded-lg">
          <h3 className="text-green-800 font-semibold">✨ Reading Sent!</h3>
          <p className="text-green-700 text-sm mt-2">
            Check your email: <strong>{email}</strong>
          </p>
          <p className="text-green-600 text-xs mt-1">
            (Check spam folder if not received in 2 minutes)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handleSendHoroscope}
        disabled={isProcessing}
        className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-400 text-white font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending Your Reading...
          </>
        ) : (
          <>
            <span className="text-2xl">✨</span>
            Get Your Personal Reading
          </>
        )}
      </button>
      
      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-purple-800 text-sm">
          <strong>What You'll Receive:</strong>
        </p>
        <ul className="text-purple-700 text-xs mt-2 space-y-1">
          <li>• Personalized ${zodiacSign} Reading</li>
          <li>• Career & Love Insights</li>
          <li>• Lucky Days & Colors</li>
          <li>• Monthly Affirmation</li>
          <li>• Crystal Recommendations</li>
        </ul>
      </div>
    </div>
  );
      
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
      setIsProcessing(false);
    }
  };

  if (pdfSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="p-4 bg-green-100 border border-green-400 rounded-lg">
          <h3 className="text-green-800 font-semibold">✅ Email Sent Successfully!</h3>
          <p className="text-green-700 text-sm mt-2">
            Check your email: <strong>{email}</strong>
          </p>
          <p className="text-green-600 text-xs mt-1">
            Redirecting to PayPal for subscription...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={handlePayPalClick}
        disabled={isProcessing}
        className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-300 text-black font-semibold rounded-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 7.27a.641.641 0 0 1 .633-.54h6.504c3.114 0 5.635 2.521 5.635 5.635 0 3.114-2.521 5.635-5.635 5.635H9.348l-.758 3.337zm7.086-9.337c0-2.206-1.789-3.995-3.995-3.995H6.577l-1.758 7.73h5.822c2.206 0 3.995-1.789 3.995-3.995z"/>
        </svg>
        {isProcessing ? 'Sending PDF...' : '🎯 Get PDF + Subscribe ($0.01)'}
      </button>
      
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm font-semibold">
          🚀 SIMPLE APPROACH:
        </p>
        <ol className="text-red-700 text-xs mt-2 space-y-1">
          <li>1. Click button → PDF sent IMMEDIATELY to your email</li>
          <li>2. Then redirected to PayPal for subscription</li>
          <li>3. NO WAITING, NO WEBHOOKS, JUST WORKS!</li>
        </ol>
      </div>
      
      <p className="text-xs text-white/50 text-center mt-3">
        Email: {email} | Zodiac: {zodiacSign}
      </p>
    </div>
  );
};

export default PayPalSubscription;