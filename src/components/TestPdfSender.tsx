import React, { useState } from 'react';
import { Resend } from 'resend';

const TestPdfSender = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setResult('');

    try {
      const resend = new Resend('re_U1nMQLbj_S2H4dx1owu1KQCNFKQG2XACF');

      const emailData = await resend.emails.send({
        from: 'noreply@cadalunastro.com',
        to: email,
        subject: `🌟 Your ${zodiacSign} Horoscope PDF`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6366f1;">🌟 Your ${zodiacSign} Horoscope! 🌟</h1>
            
            <p>Dear ${name},</p>
            
            <p><strong>SUCCESS!</strong> Your personalized horoscope is ready!</p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h2>✨ Your ${zodiacSign} Insights:</h2>
              <p>This month brings new opportunities for ${zodiacSign}. Your cosmic energy is aligned for success in both personal and professional endeavors.</p>
              <p><strong>Lucky Days:</strong> 15th, 22nd, 28th</p>
              <p><strong>Lucky Colors:</strong> Blue, Silver, Purple</p>
              <p><strong>Focus Areas:</strong> Career growth, relationships, health</p>
            </div>
            
            <p>Thank you for choosing Cosmic Calendar!</p>
            <p>Best regards,<br>The Cosmic Calendar Team</p>
          </div>
        `
      });

      console.log('Email sent:', emailData);
      setResult('✅ PDF sent! Check your email (including spam folder)');
    } catch (error) {
      console.error('Error:', error);
      setResult('❌ Error: ' + (error as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Test PDF Sender</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Zodiac Sign:</label>
          <select
            value={zodiacSign}
            onChange={(e) => setZodiacSign(e.target.value)}
            className="w-full p-2 rounded border border-gray-300"
            required
          >
            <option value="">Select your sign</option>
            <option value="Aries">Aries</option>
            <option value="Taurus">Taurus</option>
            <option value="Gemini">Gemini</option>
            <option value="Cancer">Cancer</option>
            <option value="Leo">Leo</option>
            <option value="Virgo">Virgo</option>
            <option value="Libra">Libra</option>
            <option value="Scorpio">Scorpio</option>
            <option value="Sagittarius">Sagittarius</option>
            <option value="Capricorn">Capricorn</option>
            <option value="Aquarius">Aquarius</option>
            <option value="Pisces">Pisces</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
        >
          {isSending ? 'Sending...' : 'Send Test PDF'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-3 rounded ${result.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {result}
        </div>
      )}
    </div>
  );
};

export default TestPdfSender;