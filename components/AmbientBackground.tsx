import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary lime orb - anchored to top-left (logo area radiosity) */}
      <div
        className="orb orb-lime"
        style={{
          width: '700px',
          height: '700px',
          top: '-15%',
          left: '-15%',
          animation: 'drift 30s ease-in-out infinite',
        }}
      />
      {/* Secondary lime orb - subtle accent */}
      <div
        className="orb orb-lime"
        style={{
          width: '300px',
          height: '300px',
          top: '10%',
          left: '5%',
          opacity: 0.15,
          animation: 'breathe 8s ease-in-out infinite',
        }}
      />
      {/* Primary cyan orb - bottom right area */}
      <div
        className="orb orb-cyan"
        style={{
          width: '600px',
          height: '600px',
          bottom: '-20%',
          right: '-15%',
          animation: 'drift 35s ease-in-out infinite',
          animationDelay: '-10s',
        }}
      />
      {/* Secondary cyan orb - mid-right accent */}
      <div
        className="orb orb-cyan"
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
      {/* Mixed orb - center area for depth */}
      <div
        className="orb orb-mixed"
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
      {/* Subtle bottom accent */}
      <div
        className="orb orb-lime"
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
    </div>
  );
};
