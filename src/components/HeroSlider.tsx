import React from "react";
import { CelestialBackground } from "@/components/CelestialBackground";
import { ArrowDown } from "lucide-react";
import { animate } from "framer-motion";

const VIDEO_URL = "https://sagiuomwnhl6t6cz.public.blob.vercel-storage.com/videoHero.mp4";

const HeroSlider: React.FC = () => {
  const handleScroll = () => {
    const calendar = document.getElementById("calendar");
    if (calendar) {
      const startY = window.scrollY;
      const endY = calendar.getBoundingClientRect().top + window.scrollY - 24; // 24px offset for spacing
      animate(startY, endY, {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1], // easeOutExpo
        onUpdate: (value) => window.scrollTo(0, value),
      });
    }
  };

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ minHeight: '60vh', height: 'auto', background: 'linear-gradient(135deg, #1a1446 0%, #232b5d 100%)' }}
    >
      {/* Celestial background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <CelestialBackground />
      </div>
      {/* Video original size, centered */}
      <div className="w-full flex items-center justify-center z-10">
        <video
          className="relative max-w-full max-h-[80vh] h-auto w-auto"
          src={VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      {/* Animated Button with ArrowDown icon */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <button
          onClick={handleScroll}
          className="pointer-events-auto flex items-center justify-center px-5 py-3 rounded-full bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 animate-tap-bounce"
          style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }}
          aria-label="Scroll to calendar"
        >
          <ArrowDown size={36} strokeWidth={2.5} />
        </button>
      </div>
      {/* Custom animation for button */}
      <style>{`
        @keyframes tap-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .animate-tap-bounce {
          animation: tap-bounce 2.2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider; 