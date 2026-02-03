import React from 'react';

export const PerspectiveGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Mobile: Original beautiful diffused glow */}
      <div
        className="absolute inset-0 lg:hidden"
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


      {/* Desktop: Edge-projected gradient wash with OKLCH interpolation for vibrant blends */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background: `
            /* Electric green from left edge */
            linear-gradient(in oklch 90deg, oklch(0.95 0.40 118 / 0.15) 0%, oklch(0.95 0.40 118 / 0.06) 25%, transparent 55%),
            /* Electric green from top edge */
            linear-gradient(in oklch 180deg, oklch(0.95 0.40 118 / 0.12) 0%, oklch(0.95 0.40 118 / 0.04) 20%, transparent 50%),
            /* Cyan from right edge */
            linear-gradient(in oklch 270deg, oklch(0.90 0.16 190 / 0.12) 0%, oklch(0.90 0.16 190 / 0.05) 25%, transparent 55%),
            /* Cyan from bottom edge */
            linear-gradient(in oklch 0deg, oklch(0.90 0.16 190 / 0.10) 0%, oklch(0.90 0.16 190 / 0.03) 20%, transparent 50%)
          `,
        }}
      />
      {/* Frosted halo glow layer - OKLCH interpolated blend through center */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background: `
            /* Diagonal gradient using OKLCH for smooth green→cyan transition */
            linear-gradient(in oklch 135deg, oklch(0.95 0.40 118 / 0.06) 0%, oklch(0.91 0.25 150 / 0.04) 50%, oklch(0.90 0.16 190 / 0.05) 100%)
          `,
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
};
