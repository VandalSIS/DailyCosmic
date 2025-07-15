import { motion } from "framer-motion";

interface ZodiacSymbol3DProps {
  sign: string;
  isSelected?: boolean;
}

const zodiacData = {
  "Aries ♈": { color: "from-red-500 to-orange-500", symbol: "♈" },
  "Taurus ♉": { color: "from-green-500 to-emerald-500", symbol: "♉" },
  "Gemini ♊": { color: "from-yellow-500 to-amber-500", symbol: "♊" },
  "Cancer ♋": { color: "from-blue-500 to-cyan-500", symbol: "♋" },
  "Leo ♌": { color: "from-orange-500 to-yellow-500", symbol: "♌" },
  "Virgo ♍": { color: "from-green-500 to-teal-500", symbol: "♍" },
  "Libra ♎": { color: "from-pink-500 to-rose-500", symbol: "♎" },
  "Scorpio ♏": { color: "from-red-500 to-purple-500", symbol: "♏" },
  "Sagittarius ♐": { color: "from-purple-500 to-indigo-500", symbol: "♐" },
  "Capricorn ♑": { color: "from-gray-500 to-slate-500", symbol: "♑" },
  "Aquarius ♒": { color: "from-blue-500 to-indigo-500", symbol: "♒" },
  "Pisces ♓": { color: "from-cyan-500 to-blue-500", symbol: "♓" }
};

export const ZodiacSymbol3D = ({ sign, isSelected = false }: ZodiacSymbol3DProps) => {
  const zodiacInfo = zodiacData[sign as keyof typeof zodiacData];
  
  if (!zodiacInfo) return null;

  return (
    <motion.div
      className={`relative group ${isSelected ? 'scale-110' : ''}`}
      whileHover={{ scale: 1.1, rotateY: 180 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${zodiacInfo.color} rounded-full blur-xl opacity-50 group-hover:opacity-75`}
        animate={isSelected ? { scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] } : {}}
        transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
      />

      {/* Main symbol container */}
      <motion.div
        className={`
          relative w-24 h-24 rounded-full 
          bg-gradient-to-br ${zodiacInfo.color}
          flex items-center justify-center
          shadow-lg backdrop-blur-sm
          border border-white/20
          transform perspective-1000
          group-hover:shadow-2xl
        `}
        whileHover={{ rotateY: 180 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Front side */}
        <motion.span
          className="absolute text-4xl font-bold text-white"
          style={{ backfaceVisibility: "hidden" }}
        >
          {zodiacInfo.symbol}
        </motion.span>

        {/* Back side */}
        <motion.span
          className="absolute text-lg font-medium text-white opacity-0 group-hover:opacity-100"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {sign.split(" ")[0]}
        </motion.span>
      </motion.div>

      {/* Orbital ring */}
      <motion.div
        className={`
          absolute inset-[-8px] rounded-full border-2 border-white/20
          transform perspective-1000
        `}
        animate={{ 
          rotateZ: isSelected ? 360 : 0,
          scale: isSelected ? [1, 1.05, 1] : 1
        }}
        transition={{ 
          rotateZ: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      />
    </motion.div>
  );
}; 