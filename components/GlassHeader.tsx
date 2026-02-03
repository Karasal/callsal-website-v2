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
      className={`footer-brand flex items-center gap-1 font-body text-[9px] font-bold tracking-[0.3em] text-white/20 uppercase cursor-default transition-all duration-300 ${className}`}
    >
      <span>EST</span>
      <motion.span
        initial={false}
        animate={{ color: isHovered ? '#CCFF00' : 'rgba(255, 255, 255, 0.2)' }}
        className="inline-block min-w-[50px] transition-colors"
      >
        {isHovered ? '2026' : 'MMXXVI'}
      </motion.span>
      <span>© CALL SAL.</span>
    </div>
  );
};

export { BrandingElement };

export const GlassHeader: React.FC<{
  onAuth: () => void;
  currentUser: IUser | null;
  onNavigate: (tab: string) => void;
}> = ({ onAuth, currentUser, onNavigate }) => {
  const [mstTime, setMstTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, fadeProps } = useMobileAnimations();

  useEffect(() => {
    const updateTime = () => setMstTime(new Date().toLocaleTimeString('en-US', { timeZone: 'America/Denver', hour: 'numeric', minute: '2-digit', hour12: true }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="h-16 px-4 sm:px-6 lg:px-12 flex items-center justify-between z-40 glass-nav fixed top-4 left-4 right-4 lg:top-6 lg:left-6 lg:right-6" style={{ borderRadius: '1rem' }}>
        <div className="flex items-center">
          <button
            onClick={() => onNavigate('overview')}
            className="bg-[#CCFF00] px-4 py-1.5 text-black font-display font-extrabold text-lg sm:text-xl tracking-tight mr-6 uppercase cursor-pointer rounded-lg hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all"
          >
            CALL SAL.
          </button>
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 border-l border-white/10 pl-6">
            <span className="text-[10px] font-body tracking-[0.15em] text-white/50 uppercase font-medium whitespace-nowrap">
              905-749-0266 | INFO@CALLSAL.APP | CALGARY, AB
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-10">
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[11px] font-body font-semibold text-white uppercase tracking-widest">{mstTime}</span>
            <span className="text-[10px] font-body tracking-widest text-white/40 uppercase font-medium">MST</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden text-white hover:text-white/70 transition-colors p-2"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <a href="tel:905-749-0266" className="hidden lg:flex items-center gap-3 btn-primary text-[10px] tracking-[0.15em] py-2.5 px-8">
            <Phone size={12} /> CALL SAL
          </a>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            {...(isMobile ? fadeProps : { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } })}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="lg:hidden fixed top-24 right-4 left-4 z-[60] glass-strong p-6 sm:p-8"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-4 text-white">
                <Phone size={16} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-body font-semibold tracking-widest uppercase text-white/50 leading-none mb-1">CALL</span>
                  <span className="text-[11px] font-display font-bold uppercase leading-none">905-749-0266</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Mail size={16} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-body font-semibold tracking-widest uppercase text-white/50 leading-none mb-1">EMAIL</span>
                  <span className="text-[11px] font-display font-bold uppercase leading-none">INFO@CALLSAL.APP</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <a href="tel:905-749-0266" className="w-full flex items-center justify-center gap-3 py-4 btn-primary text-[10px] tracking-widest">
                  <Phone size={12} /> CALL SAL NOW
                </a>
                {!currentUser && (
                  <>
                    <button onClick={() => { onAuth(); setIsMenuOpen(false); }} aria-label="Login" className="w-full flex items-center justify-center gap-3 py-4 btn-glass text-[10px] tracking-widest">
                      <LogIn size={12} /> LOGIN
                    </button>
                    <button onClick={() => { onAuth(); setIsMenuOpen(false); }} aria-label="Register" className="w-full flex items-center justify-center gap-3 py-4 btn-primary text-[10px] tracking-widest">
                      <UserPlus size={12} /> REGISTER
                    </button>
                  </>
                )}
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-center">
                <BrandingElement className="opacity-60" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
