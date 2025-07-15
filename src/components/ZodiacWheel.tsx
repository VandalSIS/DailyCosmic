import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const zodiacSigns = [
  { name: "Aries", symbol: "♈", color: "#FF6B6B" },
  { name: "Taurus", symbol: "♉", color: "#4ECDC4" },
  { name: "Gemini", symbol: "♊", color: "#FFD93D" },
  { name: "Cancer", symbol: "♋", color: "#6C5B7B" },
  { name: "Leo", symbol: "♌", color: "#F7B733" },
  { name: "Virgo", symbol: "♍", color: "#C06C84" },
  { name: "Libra", symbol: "♎", color: "#95E1D3" },
  { name: "Scorpio", symbol: "♏", color: "#E27D60" },
  { name: "Sagittarius", symbol: "♐", color: "#41B3A3" },
  { name: "Capricorn", symbol: "♑", color: "#553D67" },
  { name: "Aquarius", symbol: "♒", color: "#45B7D1" },
  { name: "Pisces", symbol: "♓", color: "#98B4D4" },
];

interface ZodiacWheelProps {
  selectedSign?: string;
  onSelectSign?: (sign: string) => void;
}

export const ZodiacWheel = ({ selectedSign, onSelectSign }: ZodiacWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    // Initial animation
    setIsSpinning(true);
    setRotation(rotation + 360);
    const timer = setTimeout(() => setIsSpinning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignClick = (sign: string) => {
    if (onSelectSign && !isSpinning) {
      onSelectSign(sign);
    }
  };

  return (
    <div className="relative w-[500px] h-[500px] mx-auto">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: rotation }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          type: "spring",
          stiffness: 50,
        }}
      >
        {zodiacSigns.map((sign, index) => {
          const angle = (index * 360) / 12;
          const isSelected = selectedSign === sign.name;
          
          return (
            <motion.div
              key={sign.name}
              className={`absolute w-20 h-20 -mt-10 -ml-10 rounded-full 
                flex items-center justify-center cursor-pointer
                transition-all duration-300 hover:scale-110
                ${isSelected ? 'z-10 scale-125' : 'z-0'}
                ${isSpinning ? 'pointer-events-none' : ''}`}
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${angle}deg) translate(200px) rotate(-${angle}deg)`,
                backgroundColor: sign.color,
              }}
              whileHover={{ scale: 1.2 }}
              onClick={() => handleSignClick(sign.name)}
            >
              <div className="text-white text-center">
                <div className="text-2xl font-bold">{sign.symbol}</div>
                <div className="text-xs font-medium">{sign.name}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Center decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
          <span className="text-4xl">✨</span>
        </div>
      </div>
    </div>
  );
};