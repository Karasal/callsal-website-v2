import React from 'react';
import { LogIn, UserPlus, LogOut, LayoutGrid } from 'lucide-react';
import { User as IUser } from '../types';
import { BrandingElement } from './GlassHeader';

export const GlassNav: React.FC<{
  onHome: () => void;
  onAuth: () => void;
  currentUser: IUser | null;
  setCurrentUser: (u: IUser | null) => void;
  onLogout: () => void;
  onDashboard?: () => void;
  scrollProgress?: number;
  scrollDirection?: 'forward' | 'backward';
  moduleZoom?: number;
}> = ({ onHome, onAuth, currentUser, onLogout, onDashboard, scrollProgress = 1, scrollDirection = 'forward', moduleZoom = 0 }) => {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  // Entrance animation
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const appearRaw = Math.max(0, Math.min(1, (scrollProgress - 0.15) / 0.25));
  const contentFadeRaw = Math.max(0, Math.min(1, (scrollProgress - 0.35) / 0.20));

  const appear = easeOutCubic(appearRaw);
  const contentFade = easeOutCubic(contentFadeRaw);

  // Text color transition: black → white as room goes white → black (0.7 → 1.0)
  const colorProgress = Math.min(1, Math.max(0, (scrollProgress - 0.7) * 3.33));
  const textGrey = Math.round(255 * colorProgress);
  const dynamicTextColor = `rgb(${textGrey}, ${textGrey}, ${textGrey})`;

  const isBackward = scrollDirection === 'backward';

  // Vertical position
  const backwardSlide = scrollProgress >= 0.7 ? 0 : ((0.7 - scrollProgress) / 0.7) * 100;
  const baseTranslateY = isBackward
    ? backwardSlide
    : (1 - appear) * 60;
  const translateY = baseTranslateY + (moduleZoom * 100);

  // Opacity
  const backwardOpacity = Math.min(1, scrollProgress / 0.7);
  const opacity = (isBackward ? backwardOpacity : appear) * (1 - moduleZoom);

  return (
    <>
      {/* Desktop: thin pill, bottom-right */}
      <aside
        className="hidden lg:flex fixed h-14 items-center justify-between z-[9999] bottom-6 right-6 rounded-full px-6 gap-4"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          willChange: 'transform, opacity',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Branding */}
        <div style={{ opacity: contentFade }}>
          <BrandingElement className="w-auto" textColor={dynamicTextColor} onHome={onHome} />
        </div>

        {/* Divider */}
        <div className="w-px h-6" style={{ background: `rgba(${textGrey}, ${textGrey}, ${textGrey}, 0.2)` }} />

        {/* Auth section */}
        <div className="flex items-center gap-2" style={{ opacity: contentFade, color: dynamicTextColor }}>
          {!currentUser ? (
            <>
              <button onClick={onAuth} aria-label="Login" className="flex items-center gap-1.5 py-1.5 px-3 hover:opacity-80 transition-all rounded-full" style={{ color: dynamicTextColor }}>
                <LogIn size={14} />
                <span className="text-[9px] font-display font-bold tracking-widest uppercase">LOGIN</span>
              </button>
              <button onClick={onAuth} aria-label="Register" className="flex items-center gap-1.5 btn-primary py-2 px-4 text-[9px] tracking-widest rounded-full">
                <UserPlus size={14} />
                <span>REGISTER</span>
              </button>
            </>
          ) : (
            <>
              {onDashboard && (
                <button
                  onClick={onDashboard}
                  className="flex items-center gap-2 cursor-pointer group py-1.5 px-2 rounded-full hover:bg-white/10 transition-all"
                  aria-label="Dashboard"
                >
                  <img src={currentUser.avatar} className="w-7 h-7 rounded-full border transition-colors" style={{ borderColor: `rgba(${textGrey}, ${textGrey}, ${textGrey}, 0.3)` }} alt="" />
                  <span className="text-[9px] font-display font-bold uppercase truncate max-w-[80px]" style={{ color: dynamicTextColor }}>{currentUser.name}</span>
                </button>
              )}
              <button onClick={onLogout} aria-label="Logout" className="flex items-center justify-center w-8 h-8 rounded-full text-red-400/80 hover:text-red-400 transition-all border border-red-400/20 hover:border-red-400/40">
                <LogOut size={14} />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Mobile nav - keep as-is for now (full rebuild later) */}
      <aside
        className="lg:hidden fixed h-14 flex items-center justify-around z-[9999] bottom-4 left-4 right-4 rounded-2xl px-3"
        style={{
          opacity: isMobile ? opacity : 1,
          transform: isMobile ? `translateY(${translateY}px)` : 'none',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {!currentUser ? (
          <button onClick={onAuth} aria-label="Login" className="flex items-center justify-center w-10 h-10 text-white/80">
            <LogIn size={20} />
          </button>
        ) : (
          <>
            {onDashboard && (
              <button onClick={onDashboard} aria-label="Dashboard" className="flex items-center justify-center w-10 h-10 text-white/80">
                <LayoutGrid size={20} />
              </button>
            )}
            <button onClick={onLogout} aria-label="Logout" className="flex items-center justify-center w-10 h-10 text-red-400/80">
              <LogOut size={20} />
            </button>
          </>
        )}
      </aside>
    </>
  );
};
