import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Home, User, Zap, MessageSquare, LogIn, UserPlus, LogOut } from 'lucide-react';
import { User as IUser } from '../types';
import { BrandingElement } from './GlassHeader';

export const GlassNav: React.FC<{
  activeTab: string;
  setActiveTab: (id: string) => void;
  onAuth: () => void;
  currentUser: IUser | null;
  setCurrentUser: (u: IUser | null) => void;
  onLogout: () => void;
  scrollProgress?: number;
  scrollDirection?: 'forward' | 'backward';
}> = ({ activeTab, setActiveTab, onAuth, currentUser, setCurrentUser, onLogout, scrollProgress = 1, scrollDirection = 'forward' }) => {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  // Entrance animation
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const appearRaw = Math.max(0, Math.min(1, (scrollProgress - 0.15) / 0.25));
  const contentFadeRaw = Math.max(0, Math.min(1, (scrollProgress - 0.35) / 0.20));
  const indicatorExpandRaw = Math.max(0, Math.min(1, (scrollProgress - 0.50) / 0.25));

  const appear = easeOutCubic(appearRaw);
  const contentFade = easeOutCubic(contentFadeRaw);
  const indicatorExpand = easeOutCubic(indicatorExpandRaw);

  const isBackward = scrollDirection === 'backward';

  // Vertical position:
  // Forward: rises from below
  // Backward: slides down off screen
  const translateY = isBackward
    ? (1 - scrollProgress) * 100
    : (1 - appear) * 60;

  const opacity = isBackward ? scrollProgress : appear;

  const tabs = [
    { id: 'overview', icon: <Home size={20} />, label: 'WELCOME' },
    { id: 'about', icon: <User size={20} />, label: 'MEET SALMAN' },
    { id: 'offer', icon: <Zap size={20} />, label: 'THE OFFER' },
    { id: 'consultation', icon: <MessageSquare size={20} />, label: 'BOOK MEETING' },
    ...(currentUser ? [{ id: 'dashboard', icon: <LayoutGrid size={20} />, label: currentUser.role === 'admin' ? 'ADMIN' : 'CLIENT HUB' }] : []),
  ];

  const navRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Calculate indicator position based on active tab
  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = tabs.findIndex(t => t.id === activeTab);
      const activeButton = tabRefs.current[activeIndex];
      const nav = navRef.current;

      if (activeButton && nav) {
        const navRect = nav.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();

        setIndicatorStyle({
          left: buttonRect.left - navRect.left,
          width: buttonRect.width,
        });
      }
    };

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(updateIndicator);
    });

    window.addEventListener('resize', updateIndicator);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab, tabs.length, currentUser]);

  const handleTabClick = (tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
    }
  };

  return (
    <>
      {/* Desktop nav - full width with proper margins */}
      <aside
        className="hidden lg:flex fixed h-20 items-center justify-between z-[100] glass-nav bottom-6 left-6 right-6 rounded-2xl px-8"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          willChange: 'transform, opacity',
        }}
      >
        {/* Branding - left side */}
        <div style={{ opacity: contentFade }}>
          <BrandingElement className="w-48" />
        </div>

        {/* Nav tabs - center */}
        <nav
          ref={navRef}
          className="flex items-center justify-center gap-6 relative"
          aria-label="Primary Navigation"
          style={{ opacity: contentFade }}
        >
          {/* Gradient Indicator - positioned under active tab */}
          <motion.div
            className="absolute -bottom-2 h-[3px] rounded-full pointer-events-none"
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            style={{
              opacity: indicatorExpand,
              transform: `scaleX(${indicatorExpand})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Core gradient bar */}
            <div
              className="absolute inset-x-3 inset-y-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #CCFF00 0%, #00F0FF 100%)',
              }}
            />
            {/* Soft glow */}
            <div
              className="absolute inset-x-3 -inset-y-1 rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(204, 255, 0, 0.5) 0%, rgba(0, 240, 255, 0.5) 100%)',
                filter: 'blur(6px)',
              }}
            />
          </motion.div>

          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              onClick={() => handleTabClick(tab.id)}
              aria-label={tab.label}
              className={`flex items-center justify-center gap-3 px-4 py-2 group relative bg-transparent focus:outline-none rounded-lg transition-all duration-300 ${
                activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span className={`shrink-0 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className="font-display text-[10px] tracking-[0.12em] font-bold uppercase leading-none">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Auth section - right side */}
        <div className="flex items-center gap-4" style={{ opacity: contentFade }}>
          {!currentUser ? (
            <div className="flex items-center gap-3">
              <button onClick={onAuth} aria-label="Login" className="flex items-center gap-2 py-2 text-gray-500 hover:text-gray-900 transition-all px-4 group">
                <LogIn size={16} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-display font-bold tracking-widest uppercase">LOGIN</span>
              </button>
              <button onClick={onAuth} aria-label="Register" className="flex items-center gap-2 btn-primary py-2.5 px-5 text-[10px] tracking-widest rounded-xl">
                <UserPlus size={16} />
                <span>REGISTER</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleTabClick('dashboard')} role="button" aria-label="View Dashboard">
                <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-gray-200 group-hover:border-gray-400 transition-colors" alt="" />
                <div className="text-[11px] font-display font-bold text-gray-900 uppercase truncate max-w-[100px]">{currentUser.name}</div>
              </div>
              <button onClick={onLogout} aria-label="Logout" className="flex items-center gap-2 py-2 text-red-500/80 hover:text-red-500 transition-all border border-red-500/20 hover:border-red-500/40 px-3 rounded-lg group">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile nav - full width at bottom */}
      <aside
        className="lg:hidden fixed h-16 flex items-center justify-around z-[100] glass-nav bottom-4 left-4 right-4 rounded-2xl px-2"
        style={{
          opacity: isMobile ? opacity : 1,
          transform: isMobile ? `translateY(${translateY}px)` : 'none',
        }}
      >
        <nav
          ref={!isMobile ? undefined : navRef}
          className="flex items-center justify-around w-full relative"
          aria-label="Primary Navigation"
        >
          {/* Mobile gradient indicator */}
          <motion.div
            className="absolute -bottom-1 h-[2px] rounded-full pointer-events-none"
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            <div
              className="absolute inset-x-2 inset-y-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #CCFF00 0%, #00F0FF 100%)',
              }}
            />
          </motion.div>

          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={isMobile ? (el) => { tabRefs.current[index] = el; } : undefined}
              onClick={() => handleTabClick(tab.id)}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 group relative bg-transparent focus:outline-none rounded-lg transition-all duration-300 ${
                activeTab === tab.id ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              <span className={`shrink-0 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};
