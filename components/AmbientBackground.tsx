import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* ============== MOBILE ORBS (lg:hidden) - Cyan/Teal Only ============== */}
      <div
        className="orb orb-cyan lg:hidden"
        style={{
          width: '700px',
          height: '700px',
          top: '-15%',
          left: '-15%',
          animation: 'drift 30s ease-in-out infinite',
        }}
      />
      <div
        className="orb orb-cyan lg:hidden"
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
        className="orb orb-cyan lg:hidden"
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
        className="orb orb-cyan lg:hidden"
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

      {/* ============== DESKTOP GLOW (hidden lg:block) ============== */}
      {/* Neon blue to frosty cyan/teal gradient - aurora rotation */}

      {/* Light neon blue wash - rotates counter-clockwise */}
      <div
        className="hidden lg:block absolute"
        style={{
          width: '80%',
          height: '80%',
          top: 0,
          left: 0,
          // Light neon blue: OKLCH hue ~230 (blue), high lightness
          background: 'radial-gradient(in oklch, ellipse 100% 100% at 50% 50%, oklch(0.75 0.18 230 / 0.22) 0%, oklch(0.70 0.14 220 / 0.08) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora-green 120s linear infinite',
        }}
      />

      {/* Dark frosty cyan/teal wash - rotates counter-clockwise, offset */}
      <div
        className="hidden lg:block absolute"
        style={{
          width: '80%',
          height: '80%',
          top: 0,
          left: 0,
          // Dark frosty cyan/teal: OKLCH hue ~190-200 (cyan-teal), lower lightness
          background: 'radial-gradient(in oklch, ellipse 100% 100% at 50% 50%, oklch(0.55 0.12 195 / 0.20) 0%, oklch(0.45 0.10 200 / 0.06) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'aurora-cyan 120s linear infinite',
        }}
      />
    </div>
  );
};
