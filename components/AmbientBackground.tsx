import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* ============== MOBILE ORBS (lg:hidden) - Lime & Cyan on White ============== */}
      <div
        className="orb orb-lime lg:hidden"
        style={{
          width: '600px',
          height: '600px',
          top: '-10%',
          left: '-15%',
          opacity: 0.25,
          animation: 'drift 30s ease-in-out infinite',
        }}
      />
      <div
        className="orb orb-cyan lg:hidden"
        style={{
          width: '400px',
          height: '400px',
          top: '15%',
          right: '-10%',
          opacity: 0.2,
          animation: 'breathe 8s ease-in-out infinite',
        }}
      />
      <div
        className="orb orb-lime lg:hidden"
        style={{
          width: '500px',
          height: '500px',
          bottom: '-15%',
          right: '-10%',
          opacity: 0.22,
          animation: 'drift 35s ease-in-out infinite',
          animationDelay: '-10s',
        }}
      />
      <div
        className="orb orb-cyan lg:hidden"
        style={{
          width: '350px',
          height: '350px',
          top: '45%',
          left: '5%',
          opacity: 0.18,
          animation: 'breathe 10s ease-in-out infinite',
          animationDelay: '-3s',
        }}
      />
      <div
        className="orb orb-mixed lg:hidden"
        style={{
          width: '450px',
          height: '450px',
          top: '30%',
          left: '40%',
          opacity: 0.15,
          animation: 'float-slow 40s ease-in-out infinite',
          animationDelay: '-15s',
        }}
      />
      <div
        className="orb orb-lime lg:hidden"
        style={{
          width: '300px',
          height: '300px',
          bottom: '20%',
          left: '25%',
          opacity: 0.12,
          animation: 'breathe 12s ease-in-out infinite',
          animationDelay: '-6s',
        }}
      />

      {/* ============== DESKTOP GLOW (hidden lg:block) ============== */}
      {/* Lime and Cyan gradients for white background - aurora rotation */}

      {/* Electric lime wash - rotates counter-clockwise */}
      <div
        className="hidden lg:block absolute"
        style={{
          width: '80%',
          height: '80%',
          top: 0,
          left: 0,
          // Lime green: OKLCH for vibrant gradient on white
          background: 'radial-gradient(in oklch, ellipse 100% 100% at 50% 50%, oklch(0.92 0.35 125 / 0.28) 0%, oklch(0.88 0.28 120 / 0.10) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora-green 120s linear infinite',
        }}
      />

      {/* Frosty cyan wash - rotates counter-clockwise, offset */}
      <div
        className="hidden lg:block absolute"
        style={{
          width: '80%',
          height: '80%',
          top: 0,
          left: 0,
          // Cyan/teal: OKLCH for vibrant gradient on white
          background: 'radial-gradient(in oklch, ellipse 100% 100% at 50% 50%, oklch(0.85 0.18 195 / 0.25) 0%, oklch(0.80 0.14 200 / 0.08) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora-cyan 120s linear infinite',
        }}
      />
    </div>
  );
};
