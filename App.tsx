import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileAnimations } from './hooks/useMobileAnimations';
import { User as IUser } from './types';
import { AmbientBackground } from './components/AmbientBackground';
import { PerspectiveGrid } from './components/PerspectiveGrid';
import { GlassHeader } from './components/GlassHeader';
import { GlassNav } from './components/GlassNav';
import { Hero } from './components/Hero';
import { MeetSalman } from './components/MeetSalman';
import { TheOffer } from './components/TheOffer';
import { BookingPage } from './components/BookingPage';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import ClientHubOnboarding from './components/ClientHubOnboarding';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const { isMobile, pageTransitionProps } = useMobileAnimations();

  // Scroll-driven parallax state (0 = top/hero visible, 1 = fully transitioned)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [totalScrollProgress, setTotalScrollProgress] = useState(0);
  // Track scroll direction for different enter/exit animations
  const [scrollDirection, setScrollDirection] = useState<'forward' | 'backward'>('forward');
  const lastScrollProgressRef = useRef(0);

  // Snap scroll state - tracks which snap point we're at/transitioning to
  const isSnappingRef = useRef(false);
  const snapTargetRef = useRef<number | null>(null);
  const lastScrollTopRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Track scroll position for parallax entrance (throttled with RAF)
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const transitionZone = window.innerHeight * 1.5;

    const updateScrollProgress = () => {
      const scrollTop = mainContent.scrollTop;
      const progress = Math.min(scrollTop / transitionZone, 1);

      // Track direction based on progress change
      if (progress > lastScrollProgressRef.current + 0.01) {
        setScrollDirection('forward');
      } else if (progress < lastScrollProgressRef.current - 0.01) {
        setScrollDirection('backward');
      }
      lastScrollProgressRef.current = progress;

      // Only update state if meaningfully changed (reduces re-renders)
      setScrollProgress(prev => Math.abs(prev - progress) > 0.001 ? progress : prev);

      // Total progress for the progress bar
      const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
      const total = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setTotalScrollProgress(prev => Math.abs(prev - total) > 0.1 ? total : prev);

      lastScrollTopRef.current = scrollTop;
      rafIdRef.current = null;
    };

    const onScroll = () => {
      // Throttle with RAF for smooth 60fps updates
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updateScrollProgress);
      }
    };

    // Detect scroll end to sync state and unlock snapping
    const onScrollEnd = () => {
      const scrollTop = mainContent.scrollTop;
      const progress = scrollTop / transitionZone;

      // Sync snap state based on final position
      if (isSnappingRef.current && snapTargetRef.current !== null) {
        // Check if we reached our target (within tolerance)
        const reachedTarget = Math.abs(scrollTop - snapTargetRef.current) < 20;
        if (reachedTarget) {
          isSnappingRef.current = false;
          snapTargetRef.current = null;
        }
      }
    };

    mainContent.addEventListener('scroll', onScroll, { passive: true });
    mainContent.addEventListener('scrollend', onScrollEnd, { passive: true });

    // Initial call
    updateScrollProgress();

    return () => {
      mainContent.removeEventListener('scroll', onScroll);
      mainContent.removeEventListener('scrollend', onScrollEnd);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [activeTab]);

  // Snap-scroll behavior for overview page entrance
  // One deliberate scroll = auto-transition through entire entrance animation
  useEffect(() => {
    if (activeTab !== 'overview' || isMobile) return;

    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const transitionZone = window.innerHeight * 1.5;
    const DELTA_THRESHOLD = 15; // Ignore micro-scrolls from trackpads

    // Snap to target position - smooth scroll both directions
    const snapTo = (target: number) => {
      isSnappingRef.current = true;
      snapTargetRef.current = target;

      // Smooth scroll - UI follows scrollProgress naturally
      mainContent.scrollTo({ top: target, behavior: 'smooth' });

      // Fallback timeout in case scrollend doesn't fire
      setTimeout(() => {
        if (isSnappingRef.current) {
          isSnappingRef.current = false;
          snapTargetRef.current = null;
        }
      }, 800);
    };

    const handleWheel = (e: WheelEvent) => {
      const scrollTop = mainContent.scrollTop;
      const isInEntranceZone = scrollTop < transitionZone + 50;

      // Beyond entrance zone - allow normal scrolling
      if (!isInEntranceZone) return;

      // Block all scroll input while snap animation is in progress
      if (isSnappingRef.current) {
        e.preventDefault();
        return;
      }

      // Ignore micro-scrolls (trackpad noise)
      if (Math.abs(e.deltaY) < DELTA_THRESHOLD) {
        e.preventDefault();
        return;
      }

      const scrollingDown = e.deltaY > 0;
      const isAtTop = scrollTop < 20;
      const isAtSnapEnd = scrollTop >= transitionZone - 20;

      // At diorama → snap to content
      if (isAtTop && scrollingDown) {
        e.preventDefault();
        snapTo(transitionZone);
        return;
      }

      // At content → snap back to diorama
      if (isAtSnapEnd && !scrollingDown) {
        e.preventDefault();
        snapTo(0);
        return;
      }

      // Caught in between → snap to nearest based on direction
      if (!isAtTop && !isAtSnapEnd) {
        e.preventDefault();
        snapTo(scrollingDown ? transitionZone : 0);
      }
    };

    // Touch handling for tablets/touch-enabled laptops
    let touchStartY = 0;
    const TOUCH_THRESHOLD = 50;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSnappingRef.current) return;

      const scrollTop = mainContent.scrollTop;
      const isInEntranceZone = scrollTop < transitionZone + 50;
      if (!isInEntranceZone) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

      const swipedDown = deltaY > 0;
      const isAtTop = scrollTop < 20;
      const isAtSnapEnd = scrollTop >= transitionZone - 20;

      if (isAtTop && swipedDown) {
        snapTo(transitionZone);
      } else if (isAtSnapEnd && !swipedDown) {
        snapTo(0);
      } else if (!isAtTop && !isAtSnapEnd) {
        snapTo(swipedDown ? transitionZone : 0);
      }
    };

    mainContent.addEventListener('wheel', handleWheel, { passive: false });
    mainContent.addEventListener('touchstart', handleTouchStart, { passive: true });
    mainContent.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      mainContent.removeEventListener('wheel', handleWheel);
      mainContent.removeEventListener('touchstart', handleTouchStart);
      mainContent.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, isMobile]);

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
      case 'overview': return <Hero onStart={() => handleNavigation('about')} onConsultation={() => handleNavigation('consultation')} scrollProgress={scrollProgress} />;
      case 'about': return <MeetSalman onNext={() => handleNavigation('offer')} onConsultation={() => handleNavigation('consultation')} />;
      case 'offer': return <TheOffer onConsultation={() => handleNavigation('consultation')} />;
      case 'consultation': return <BookingPage />;
      case 'dashboard':
        if (!currentUser) return null;
        return <Dashboard user={currentUser} />;
      default: return <Hero onStart={() => handleNavigation('about')} onConsultation={() => handleNavigation('consultation')} scrollProgress={scrollProgress} />;
    }
  };

  // Full-page onboarding takeover for clients who haven't completed it
  if (currentUser && currentUser.role === 'client' && !currentUser.hasCompletedOnboarding) {
    return (
      <>
        <PerspectiveGrid />
        <AmbientBackground />
        <ClientHubOnboarding user={currentUser} onComplete={refreshUser} />
      </>
    );
  }

  return (
    <div className="relative h-screen w-screen flex flex-col bg-white overflow-hidden selection:bg-[#CCFF00] selection:text-black font-body noise-overlay">
      {/* Hide grid and ambient glow during entrance transition on overview page */}
      <div style={{ opacity: activeTab === 'overview' ? scrollProgress : 1 }}>
        <PerspectiveGrid />
        <AmbientBackground />
      </div>

      {/* Gradient Scroll Progress Bar - always visible, always on top */}
      <div
        className="fixed top-0 left-0 h-[3px] z-[999]"
        style={{
          width: `${totalScrollProgress}%`,
          background: 'linear-gradient(90deg, #CCFF00 0%, #00F0FF 100%)',
          boxShadow: '0 0 10px rgba(204, 255, 0, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        }}
      />

      <GlassHeader
        onAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onNavigate={handleNavigation}
        scrollProgress={activeTab === 'overview' ? scrollProgress : 1}
        scrollDirection={activeTab === 'overview' ? scrollDirection : 'forward'}
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
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => { setCurrentUser(user); setActiveTab('dashboard'); }}
      />
      <GlassNav
        activeTab={activeTab}
        setActiveTab={handleNavigation}
        onAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onLogout={handleLogout}
        scrollProgress={activeTab === 'overview' ? scrollProgress : 1}
        scrollDirection={activeTab === 'overview' ? scrollDirection : 'forward'}
      />
    </div>
  );
};

export default App;
