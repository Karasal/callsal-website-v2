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
}> = ({ activeTab, setActiveTab, onAuth, currentUser, setCurrentUser, onLogout }) => {
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
  }, [activeTab, tabs.length, currentUser]);

  const handleTabClick = (tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
    }
  };

  return (
    <aside className="fixed bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 glass-nav h-16 lg:h-20 flex items-center justify-between px-4 lg:px-12 z-[100]">
      <BrandingElement className="hidden lg:flex w-48" />

      <nav
        ref={navRef}
        className="flex-1 flex flex-row w-full justify-around lg:justify-center lg:gap-8 relative"
        aria-label="Primary Navigation"
      >
        {/* Premium Gradient Indicator */}
        <motion.div
          className="absolute bottom-1 h-[2px] rounded-full pointer-events-none"
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
          {/* Core gradient bar */}
          <div
            className="absolute inset-x-4 inset-y-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #CCFF00 0%, #00F0FF 100%)',
            }}
          />
          {/* Soft glow */}
          <div
            className="absolute inset-x-4 -inset-y-1 rounded-full"
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
            className={`flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-3 px-2 lg:px-5 py-2 group relative bg-transparent focus:outline-none rounded-lg transition-all duration-300 ${
              activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className={`shrink-0 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110 -translate-y-0.5' : ''}`}>
              {tab.icon}
            </span>
            <span className="hidden lg:block font-display text-[10px] tracking-[0.15em] font-bold uppercase leading-none">
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="hidden lg:flex items-center gap-6 ml-8 pl-8 border-l border-white/10">
        {!currentUser ? (
          <div className="flex items-center gap-3">
            <button onClick={onAuth} aria-label="Login" className="flex items-center gap-2 py-2 text-white/60 hover:text-white transition-all px-4 group">
              <LogIn size={16} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-display font-bold tracking-widest uppercase">LOGIN</span>
            </button>
            <button onClick={onAuth} aria-label="Register" className="flex items-center gap-2 btn-primary py-2.5 px-5 text-[10px] tracking-widest">
              <UserPlus size={16} />
              <span>REGISTER</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleTabClick('dashboard')} role="button" aria-label="View Dashboard">
              <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-white/20 group-hover:border-white/40 transition-colors" alt="" />
              <div className="text-[11px] font-display font-bold text-white uppercase truncate max-w-[100px]">{currentUser.name}</div>
            </div>
            <button onClick={onLogout} aria-label="Logout" className="flex items-center gap-2 py-2 text-red-500/80 hover:text-red-500 transition-all border border-red-500/20 hover:border-red-500/40 px-3 rounded-lg group">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
