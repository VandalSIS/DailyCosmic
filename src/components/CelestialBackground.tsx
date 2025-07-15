import { useEffect, useRef, useState } from 'react';

interface Star {
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export function CelestialBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const [stars] = useState<Star[]>(() => 
    Array.from({ length: 150 }, () => ({
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2
    }))
  );

  useEffect(() => {
    if (!containerRef.current || !starsRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate relative position (-1 to 1)
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      
      // Apply parallax effect with smooth transition
      if (starsRef.current) {
        starsRef.current.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-[#0a0a1f]">
      {/* Deep space gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-[#1a1a4f] via-[#0a0a2f] to-[#0a0a1f] opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a4f]/10 to-[#0a0a1f] opacity-60" />
      </div>

      {/* Nebula effects */}
      <div className="absolute inset-0">
        {/* Purple nebula */}
        <div className="absolute w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] 
          top-[10%] left-[5%] animate-pulse-slow transform rotate-12" />
        
        {/* Blue nebula */}
        <div className="absolute w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] 
          bottom-[20%] right-[10%] animate-pulse-slow transform -rotate-12"
          style={{ animationDelay: '2s' }} />
        
        {/* Pink accent */}
        <div className="absolute w-[40%] h-[40%] bg-pink-500/5 rounded-full blur-[150px] 
          top-[40%] left-[30%] animate-pulse-slow transform rotate-45"
          style={{ animationDelay: '1s' }} />
      </div>

      {/* Stars container with parallax */}
      <div ref={starsRef} className="absolute inset-0 transition-transform duration-300 ease-out">
        {/* Dynamic stars */}
        {stars.map((star, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.x}%`,
              top: `${star.y}%`,
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              boxShadow: `0 0 ${star.size * 2}px ${star.size / 2}px rgba(255, 255, 255, 0.5)`
            }}
          />
        ))}

        {/* Shooting stars */}
        <div className="absolute w-[150px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent
          -rotate-[45deg] animate-shooting-star"
          style={{ top: '20%', left: '80%' }} />
        <div className="absolute w-[100px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent
          -rotate-[35deg] animate-shooting-star-delayed"
          style={{ top: '40%', left: '60%' }} />
      </div>

      {/* Cosmic dust particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_60%)] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)] opacity-40 animate-pulse-slow" />
      </div>

      {/* Text readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a1f]/40 pointer-events-none" />
    </div>
  );
} 