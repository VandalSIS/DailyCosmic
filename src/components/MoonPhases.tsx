
import React from 'react';

const MoonPhases = () => {
  return (
    <div className="absolute top-20 right-20 opacity-20">
      <svg width="80" height="80" viewBox="0 0 80 80" className="animate-spin" style={{ animationDuration: '30s' }}>
        <defs>
          <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="35" fill="url(#moonGradient)" stroke="#94a3b8" strokeWidth="2" />
        <path d="M 40 5 A 35 35 0 0 0 40 75 A 28 28 0 0 1 40 5" fill="#64748b" opacity="0.3" />
      </svg>
    </div>
  );
};

export default MoonPhases;
