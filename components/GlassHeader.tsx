import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Mail, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileAnimations } from '../hooks/useMobileAnimations';
import { User as IUser } from '../types';

const BrandingElement = ({ className = "" }: { className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`footer-brand flex items-center font-body text-[9px] font-bold tracking-normal text-gray-400 uppercase cursor-default transition-all duration-300 whitespace-nowrap ${className}`}
    >
      <span>EST</span>
      <motion.span
        initial={false}
        animate={{ color: isHovered ? '#CCFF00' : 'rgba(0, 0, 0, 0.4)' }}
        className="inline-block transition-colors mx-2"
      >
        {isHovered ? '2026' : 'MMXXVI'}
      </motion.span>
      <span>©</span>
      <span className="ml-2">CALL SAL .</span>
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
}> = ({ onAuth, currentUser, onNavigate, scrollProgress = 1, scrollDirection = 'forward' }) => {
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

  const isBackward = scrollDirection === 'backward';

  // Vertical position:
  // Forward: drops in from above
  // Backward: slides up off screen
  const translateY = isBackward
    ? (1 - scrollProgress) * -100
    : (1 - appear) * -60;

  const opacity = isBackward ? scrollProgress : appear;

  return (
    <>
      {/* Desktop: Compact pill in top-left */}
      <header
        className="hidden lg:flex h-14 items-center justify-center z-40 glass-nav fixed top-6 left-6 rounded-full px-3"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          willChange: 'transform, opacity',
        }}
      >
        <div className="flex items-center gap-3" style={{ opacity: contentFade }}>
          {/* Logo with phone icon - clickable to call */}
          <a
            href="tel:905-749-0266"
            className="bg-[#CCFF00] pl-2.5 pr-3 py-1.5 text-black font-display font-extrabold text-sm tracking-tight uppercase cursor-pointer rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:shadow-[0_0_35px_rgba(204,255,0,0.6)] transition-all animate-logo-glow flex items-center gap-2"
          >
            <Phone size={14} strokeWidth={2.5} />
            <span>CALL SAL</span>
          </a>

          {/* Condensed info */}
          <div className="flex items-center gap-2 text-[9px] font-body tracking-[0.1em] text-gray-500 uppercase font-medium">
            <span>905-749-0266</span>
            <span className="text-gray-300">|</span>
            <span>CALGARY, AB</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-900 font-semibold">{mstTime}</span>
            <span className="text-gray-400">MST</span>
          </div>
        </div>
      </header>

      {/* Mobile: Full-width bar */}
      <header
        className="lg:hidden h-14 flex items-center justify-between z-40 glass-nav fixed top-4 left-4 right-4 rounded-2xl px-4"
        style={{
          opacity: isMobile ? opacity : 1,
          transform: isMobile ? `translateY(${translateY}px)` : 'none',
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
          className="text-gray-700 hover:text-gray-900 transition-colors p-2"
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
              <div className="flex items-center gap-4 text-gray-900">
                <Phone size={16} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-body font-semibold tracking-widest uppercase text-gray-500 leading-none mb-1">CALL</span>
                  <span className="text-[11px] font-display font-bold uppercase leading-none">905-749-0266</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-900">
                <Mail size={16} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-body font-semibold tracking-widest uppercase text-gray-500 leading-none mb-1">EMAIL</span>
                  <span className="text-[11px] font-display font-bold uppercase leading-none">INFO@CALLSAL.APP</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
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

              <div className="pt-6 border-t border-gray-100 flex justify-center">
                <BrandingElement className="opacity-60" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
