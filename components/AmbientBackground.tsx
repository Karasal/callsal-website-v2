import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* ============== MOBILE ORBS (lg:hidden) - LOCKED, DO NOT EDIT ============== */}
      <div
        className="orb orb-lime lg:hidden"
        style={{
          width: '700px',
          height: '700px',
          top: '-15%',
          left: '-15%',
          animation: 'drift 30s ease-in-out infinite',
        }}
      />
      <div
        className="orb orb-lime lg:hidden"
        style={{
          width: '300px',
          height: '300px',
          top: '10%',
          left: '5%',
          opacity: 0.15,
          animation: 'breathe 8s ease-in-out infinite',
        }}
      />
      <div
        className="orb orb-cyan lg:hidden"
        style={{
          width: '600px',
          height: '600px',
          bottom: '-20%',
          right: '-15%',
          animation: 'drift 35s ease-in-out infinite',
          animationDelay: '-10s',
        }}
      />
      <div
        className="orb orb-cyan lg:hidden"
        style={{
          width: '250px',
          height: '250px',
          top: '50%',
          right: '5%',
          opacity: 0.12,
          animation: 'breathe 10s ease-in-out infinite',
          animationDelay: '-3s',
        }}
      />
      <div
        className="orb orb-mixed lg:hidden"
        style={{
          width: '500px',
          height: '500px',
          top: '35%',
          left: '40%',
          opacity: 0.1,
          animation: 'float-slow 40s ease-in-out infinite',
          animationDelay: '-15s',
        }}
      />
      <div
        className="orb orb-lime lg:hidden"
        style={{
          width: '400px',
          height: '400px',
          bottom: '10%',
          left: '20%',
          opacity: 0.08,
          animation: 'breathe 12s ease-in-out infinite',
          animationDelay: '-6s',
        }}
      />

      {/* ============== DESKTOP GLOW (hidden lg:block) - EDIT FREELY ============== */}
      {/* Edge-projected frosted aura with slow counter-clockwise rotation */}

      {/* Electric green wash - rotates counter-clockwise around edges */}
      <div
        className="hidden lg:block absolute"
        style={{
          width: '80%',
          height: '80%',
          top: 0,
          left: 0,
          background: 'radial-gradient(in oklch, ellipse 100% 100% at 50% 50%, oklch(0.95 0.40 118 / 0.24) 0%, oklch(0.95 0.40 118 / 0.08) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora-green 120s linear infinite',
        }}
      />

      {/* Cyan wash - rotates counter-clockwise, offset from green */}
      <div
        className="hidden lg:block absolute"
        style={{
          width: '80%',
          height: '80%',
          top: 0,
          left: 0,
          background: 'radial-gradient(in oklch, ellipse 100% 100% at 50% 50%, oklch(0.90 0.16 190 / 0.20) 0%, oklch(0.90 0.16 190 / 0.06) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora-cyan 120s linear infinite',
        }}
      />
    </div>
  );
};
