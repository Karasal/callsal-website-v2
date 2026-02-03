import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Lime orb - top left */}
      <div
        className="orb orb-lime"
        style={{
          width: '600px',
          height: '600px',
          top: '-10%',
          left: '-10%',
          animation: 'float-slow 20s ease-in-out infinite',
        }}
      />
      {/* Cyan orb - bottom right */}
      <div
        className="orb orb-cyan"
        style={{
          width: '500px',
          height: '500px',
          bottom: '-10%',
          right: '-10%',
          animation: 'float 15s ease-in-out infinite',
          animationDelay: '5s',
        }}
      />
      {/* Mixed orb - center */}
      <div
        className="orb orb-mixed"
        style={{
          width: '400px',
          height: '400px',
          top: '40%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.15,
          animation: 'float-slow 25s ease-in-out infinite',
          animationDelay: '10s',
        }}
      />
    </div>
  );
};
