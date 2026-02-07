import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Mail, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileAnimations } from '../hooks/useMobileAnimations';
import { User as IUser } from '../types';

const BrandingElement = ({ className = "", textColor = "#000000", onHome }: { className?: string; textColor?: string; onHome?: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`footer-brand flex items-center font-body text-[9px] font-bold tracking-normal uppercase cursor-default transition-all duration-300 whitespace-nowrap ${className}`}
      style={{ color: textColor }}
    >
      <span>EST</span>
      <motion.span
        initial={false}
        animate={{ color: isHovered ? '#CCFF00' : textColor }}
        className="inline-block transition-colors mx-2"
      >
        {isHovered ? '2026' : 'MMXXVI'}
      </motion.span>
      <span>©</span>
      {onHome ? (
        <button onClick={onHome} className="ml-2 cursor-pointer hover:text-[#CCFF00] transition-colors">CALL SAL .</button>
      ) : (
        <span className="ml-2">CALL SAL .</span>
      )}
    </div>
  );
};

export { BrandingElement };

export const GlassHeader: React.FC<{
  onAuth: () => void;
  currentUser: IUser | null;
  onNavigate: (tab: string) => void;
  scrollProgress?: number;
  scrollDirection?: 'forward' | 'backward';
  moduleZoom?: number;
}> = ({ onAuth, currentUser, onNavigate, scrollProgress = 1, scrollDirection = 'forward', moduleZoom = 0 }) => {
  const [mstTime, setMstTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, fadeProps } = useMobileAnimations();

  useEffect(() => {
    const updateTime = () => setMstTime(new Date().toLocaleTimeString('en-US', { timeZone: 'America/Denver', hour: 'numeric', minute: '2-digit', hour12: true }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simple entrance animation - pill drops in
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

  // Vertical position:
  // Forward: drops in from above
  // Backward: slides up off screen (but stays in place at 0.7+)
  // Module zoom: slides up off screen
  // For backward: fully in position at scrollProgress >= 0.7, slides out below
  const backwardSlide = scrollProgress >= 0.7 ? 0 : ((0.7 - scrollProgress) / 0.7) * -100;
  const baseTranslateY = isBackward
    ? backwardSlide
    : (1 - appear) * -60;
  const translateY = baseTranslateY - (moduleZoom * 100);

  // Opacity: fully visible at hero snap point (0.7) and above
  // For backward: remap so 0.7+ = 1.0, below 0.7 fades to 0
  const backwardOpacity = Math.min(1, scrollProgress / 0.7);
  const opacity = (isBackward ? backwardOpacity : appear) * (1 - moduleZoom);

  return (
    <>
      {/* Desktop: Compact pill in top-left */}
      <header
        className="hidden lg:flex h-14 items-center justify-center z-[9999] fixed top-6 left-6 rounded-full px-3 overflow-visible"
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
        <div className="flex items-center gap-3" style={{ opacity: contentFade }}>
          {/* Logo with phone icon - clickable to call */}
          <a
            href="tel:905-749-0266"
            className="bg-[#CCFF00] pl-2.5 pr-3 py-1.5 text-black font-display font-extrabold text-sm tracking-tight uppercase cursor-pointer rounded-full shadow-[0_0_10px_rgba(204,255,0,0.15)] hover:shadow-[0_0_20px_rgba(204,255,0,0.5),0_0_40px_rgba(0,240,255,0.3),0_0_60px_rgba(204,255,0,0.15)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Phone size={14} strokeWidth={2.5} />
            <span>CALL SAL</span>
          </a>

          {/* Condensed info - color transitions black → white with room */}
          <div
            className="flex items-center gap-2 text-[9px] font-body tracking-[0.1em] uppercase font-medium"
            style={{ color: dynamicTextColor }}
          >
            <span>905-749-0266</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>CALGARY, AB</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span className="font-semibold">{mstTime}</span>
            <span style={{ opacity: 0.7 }}>MST</span>
          </div>
        </div>
      </header>

      {/* Mobile: Full-width bar */}
      <header
        className="lg:hidden h-14 flex items-center justify-between z-[9999] fixed top-4 left-4 right-4 rounded-2xl px-4 overflow-visible"
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
        <a
          href="tel:905-749-0266"
          className="bg-[#CCFF00] pl-2 pr-3 py-1.5 text-black font-display font-extrabold text-sm tracking-tight uppercase cursor-pointer rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)] flex items-center gap-1.5"
        >
          <Phone size={14} strokeWidth={2.5} />
          <span>CALL SAL</span>
        </a>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-white hover:text-white/80 transition-colors p-2"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            {...(isMobile ? fadeProps : { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } })}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="lg:hidden fixed top-24 right-4 left-4 z-[60] glass-strong p-6 sm:p-8 rounded-2xl"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-4 text-white">
                <Phone size={16} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-body font-semibold tracking-widest uppercase text-gray-400 leading-none mb-1">CALL</span>
                  <span className="text-[11px] font-display font-bold uppercase leading-none">905-749-0266</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Mail size={16} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-body font-semibold tracking-widest uppercase text-gray-400 leading-none mb-1">EMAIL</span>
                  <span className="text-[11px] font-display font-bold uppercase leading-none">INFO@CALLSAL.APP</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 flex flex-col gap-3">
                <a href="tel:905-749-0266" className="w-full flex items-center justify-center gap-3 py-4 btn-primary text-[10px] tracking-widest rounded-xl">
                  <Phone size={12} /> CALL SAL NOW
                </a>
                {!currentUser && (
                  <>
                    <button onClick={() => { onAuth(); setIsMenuOpen(false); }} aria-label="Login" className="w-full flex items-center justify-center gap-3 py-4 btn-glass text-[10px] tracking-widest rounded-xl">
                      <LogIn size={12} /> LOGIN
                    </button>
                    <button onClick={() => { onAuth(); setIsMenuOpen(false); }} aria-label="Register" className="w-full flex items-center justify-center gap-3 py-4 btn-primary text-[10px] tracking-widest rounded-xl">
                      <UserPlus size={12} /> REGISTER
                    </button>
                  </>
                )}
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-center">
                <BrandingElement className="opacity-60" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
