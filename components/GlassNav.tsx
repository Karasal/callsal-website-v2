import React from 'react';
import { LayoutGrid, Home, User, Zap, MessageSquare, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useMobileAnimations } from '../hooks/useMobileAnimations';
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

  return (
    <aside className="fixed bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 glass-nav h-16 lg:h-20 flex items-center justify-between px-4 lg:px-12 z-[100]">
      <BrandingElement className="hidden lg:flex w-48" />

      <nav className="flex-1 flex flex-row w-full justify-around lg:justify-center lg:gap-8" aria-label="Primary Navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            className={`flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-3 px-2 lg:px-5 py-2 group relative bg-transparent focus:outline-none rounded-lg transition-all ${
              activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className="shrink-0">{tab.icon}</span>
            <span className="hidden lg:block font-display text-[10px] tracking-[0.15em] font-bold uppercase leading-none">{tab.label}</span>
            {/* Active indicator - gradient line */}
            <span
              className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all duration-500 ${
                activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
              }`}
              style={{
                background: 'linear-gradient(90deg, #CCFF00 0%, #00F0FF 100%)',
                boxShadow: activeTab === tab.id
                  ? '0 0 10px rgba(204, 255, 0, 0.4), 0 0 20px rgba(0, 240, 255, 0.2)'
                  : 'none'
              }}
              aria-hidden="true"
            />
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
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')} role="button" aria-label="View Dashboard">
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
