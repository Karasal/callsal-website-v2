import React from 'react';

export const PerspectiveGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base ambient color wash - no pure black anywhere */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 150% 100% at 0% 0%, rgba(204, 255, 0, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 150% 100% at 100% 100%, rgba(0, 240, 255, 0.07) 0%, transparent 60%),
            radial-gradient(ellipse 120% 80% at 100% 0%, rgba(0, 240, 255, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse 120% 80% at 0% 100%, rgba(204, 255, 0, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(150, 220, 150, 0.02) 0%, transparent 70%)
          `,
        }}
      />
    </div>
  );
};
