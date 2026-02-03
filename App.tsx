import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileAnimations } from './hooks/useMobileAnimations';
import { User as IUser } from './types';
import { AmbientBackground } from './components/AmbientBackground';
import { GlassHeader } from './components/GlassHeader';
import { GlassNav } from './components/GlassNav';
import { Hero } from './components/Hero';
import { MeetSalman } from './components/MeetSalman';
import { TheOffer } from './components/TheOffer';
import { BookingPage } from './components/BookingPage';

const Placeholder = ({ name }: { name: string }) => (
  <div className="glass p-12 text-center">
    <h2 className="font-display text-3xl font-bold gradient-text mb-4">{name}</h2>
    <p className="text-white/60 font-body">Component coming in next phase.</p>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const { isMobile, pageTransitionProps } = useMobileAnimations();

  // Hash-based deep linking
  useEffect(() => {
    const hashToTab: Record<string, string> = {
      '#book': 'consultation',
      '#consultation': 'consultation',
      '#meeting': 'consultation',
      '#offer': 'offer',
      '#about': 'about',
      '#meet': 'about'
    };

    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash && hashToTab[hash]) {
        setActiveTab(hashToTab[hash]);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Check auth on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.user) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        // Not logged in
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {}
    setCurrentUser(null);
    setActiveTab('overview');
  };

  const handleNavigation = (tabId: string) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTop = 0;
    window.scrollTo(0, 0);
  };

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
      }
    } catch (err) {}
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Hero onStart={() => handleNavigation('about')} onConsultation={() => handleNavigation('consultation')} />;
      case 'about': return <MeetSalman onNext={() => handleNavigation('offer')} onConsultation={() => handleNavigation('consultation')} />;
      case 'offer': return <TheOffer onConsultation={() => handleNavigation('consultation')} />;
      case 'consultation': return <BookingPage />;
      case 'dashboard':
        if (!currentUser) return null;
        return <Placeholder name="Dashboard" />;
      default: return <Placeholder name="Hero" />;
    }
  };

  return (
    <div className="relative h-screen w-screen flex flex-col bg-black overflow-hidden selection:bg-[#CCFF00] selection:text-black font-body noise-overlay">
      <AmbientBackground />
      <GlassHeader
        onAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onNavigate={handleNavigation}
      />
      <main id="main-content" className="flex-1 overflow-x-hidden relative p-4 sm:p-6 lg:p-12 lg:pb-32 pb-28 pt-24 lg:pt-28 overflow-y-auto">
        {isMobile ? (
          <div className="min-h-full">
            {renderContent()}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              {...pageTransitionProps}
              className="min-h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <GlassNav
        activeTab={activeTab}
        setActiveTab={handleNavigation}
        onAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default App;
