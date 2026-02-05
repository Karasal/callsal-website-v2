import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileAnimations } from './hooks/useMobileAnimations';
import { User as IUser } from './types';
import { GlassHeader } from './components/GlassHeader';
import { GlassNav } from './components/GlassNav';
import { Hero } from './components/Hero';
import { ModuleManager } from './components/ModuleManager';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import ClientHubOnboarding from './components/ClientHubOnboarding';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [cinematicsMode, setCinematicsMode] = useState(false);
  const [bookingMode, setBookingMode] = useState(false);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [moduleZoom, setModuleZoom] = useState(0);
  const { isMobile, pageTransitionProps } = useMobileAnimations();

  // Shared mouse state for 3D parallax
  const [smoothMouse, setSmoothMouse] = useState({ x: 0.5, y: 0.5 });
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const mouseAnimationRef = useRef<number | null>(null);

  // Mouse tracking with smooth interpolation
  useEffect(() => {
    if (isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMouseMove);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      smoothMouseRef.current.x = lerp(smoothMouseRef.current.x, mouseRef.current.x, 0.06);
      smoothMouseRef.current.y = lerp(smoothMouseRef.current.y, mouseRef.current.y, 0.06);

      setSmoothMouse(prev => {
        const dx = Math.abs(prev.x - smoothMouseRef.current.x);
        const dy = Math.abs(prev.y - smoothMouseRef.current.y);
        if (dx > 0.001 || dy > 0.001) {
          return { x: smoothMouseRef.current.x, y: smoothMouseRef.current.y };
        }
        return prev;
      });

      mouseAnimationRef.current = requestAnimationFrame(animate);
    };
    mouseAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (mouseAnimationRef.current) cancelAnimationFrame(mouseAnimationRef.current);
    };
  }, [isMobile]);

  // Scroll state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [totalScrollProgress, setTotalScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'forward' | 'backward'>('forward');
  const lastScrollProgressRef = useRef(0);

  // Snap scroll state
  const isSnappingRef = useRef(false);
  const snapTargetRef = useRef<number | null>(null);
  const lastScrollTopRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Reset snap state when overlays change
  const prevModuleZoomRef = useRef(0);
  useEffect(() => {
    isSnappingRef.current = false;
    snapTargetRef.current = null;
  }, [cinematicsMode, bookingMode]);

  useEffect(() => {
    const wasOpen = prevModuleZoomRef.current > 0.5;
    const isClosed = moduleZoom < 0.1;
    if (wasOpen && isClosed) {
      isSnappingRef.current = false;
      snapTargetRef.current = null;
    }
    prevModuleZoomRef.current = moduleZoom;
  }, [moduleZoom]);

  // Track scroll position
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const transitionZone = window.innerHeight * 1.5;

    const updateScrollProgress = () => {
      const scrollTop = mainContent.scrollTop;
      const progress = Math.min(scrollTop / transitionZone, 1);

      if (progress > lastScrollProgressRef.current + 0.01) {
        setScrollDirection('forward');
      } else if (progress < lastScrollProgressRef.current - 0.01) {
        setScrollDirection('backward');
      }
      lastScrollProgressRef.current = progress;

      setScrollProgress(prev => Math.abs(prev - progress) > 0.001 ? progress : prev);

      const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
      const total = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setTotalScrollProgress(prev => Math.abs(prev - total) > 0.1 ? total : prev);

      lastScrollTopRef.current = scrollTop;
      rafIdRef.current = null;
    };

    const onScroll = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updateScrollProgress);
      }
    };

    const onScrollEnd = () => {
      const scrollTop = mainContent.scrollTop;
      if (isSnappingRef.current && snapTargetRef.current !== null) {
        const reachedTarget = Math.abs(scrollTop - snapTargetRef.current) < 20;
        if (reachedTarget) {
          isSnappingRef.current = false;
          snapTargetRef.current = null;
        }
      }
    };

    mainContent.addEventListener('scroll', onScroll, { passive: true });
    mainContent.addEventListener('scrollend', onScrollEnd, { passive: true });
    updateScrollProgress();

    return () => {
      mainContent.removeEventListener('scroll', onScroll);
      mainContent.removeEventListener('scrollend', onScrollEnd);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [activeTab]);

  // Snap-scroll behavior
  useEffect(() => {
    if (activeTab !== 'overview' || isMobile) return;

    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const transitionZone = window.innerHeight * 1.5;
    const DELTA_THRESHOLD = 15;

    const SNAP_DIORAMA = 0;
    const SNAP_HERO = transitionZone * 0.7;
    const SNAP_MODULES = transitionZone;

    const snapTo = (target: number) => {
      isSnappingRef.current = true;
      snapTargetRef.current = target;
      mainContent.scrollTo({ top: target, behavior: 'smooth' });
      setTimeout(() => {
        if (isSnappingRef.current) {
          isSnappingRef.current = false;
          snapTargetRef.current = null;
        }
      }, 800);
    };

    const getSnapZone = (scrollTop: number): 'diorama' | 'hero' | 'modules' => {
      const heroThreshold = SNAP_HERO * 0.5;
      const modulesThreshold = SNAP_HERO + (SNAP_MODULES - SNAP_HERO) * 0.5;
      if (scrollTop < heroThreshold) return 'diorama';
      if (scrollTop < modulesThreshold) return 'hero';
      return 'modules';
    };

    const handleWheel = (e: WheelEvent) => {
      if (cinematicsMode || bookingMode || moduleZoom > 0) return;

      const scrollTop = mainContent.scrollTop;
      const isInEntranceZone = scrollTop < transitionZone + 50;
      if (!isInEntranceZone) return;

      if (isSnappingRef.current) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < DELTA_THRESHOLD) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const scrollingDown = e.deltaY > 0;
      const currentZone = getSnapZone(scrollTop);

      if (scrollingDown) {
        if (currentZone === 'diorama') snapTo(SNAP_HERO);
        else if (currentZone === 'hero') snapTo(SNAP_MODULES);
      } else {
        if (currentZone === 'modules') snapTo(SNAP_HERO);
        else if (currentZone === 'hero') snapTo(SNAP_DIORAMA);
      }
    };

    let touchStartY = 0;
    const TOUCH_THRESHOLD = 50;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (cinematicsMode || bookingMode || moduleZoom > 0) return;
      if (isSnappingRef.current) return;

      const scrollTop = mainContent.scrollTop;
      const isInEntranceZone = scrollTop < transitionZone + 50;
      if (!isInEntranceZone) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

      const swipedDown = deltaY > 0;
      const currentZone = getSnapZone(scrollTop);

      if (swipedDown) {
        if (currentZone === 'diorama') snapTo(SNAP_HERO);
        else if (currentZone === 'hero') snapTo(SNAP_MODULES);
      } else {
        if (currentZone === 'modules') snapTo(SNAP_HERO);
        else if (currentZone === 'hero') snapTo(SNAP_DIORAMA);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    mainContent.addEventListener('touchstart', handleTouchStart, { passive: true });
    mainContent.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      mainContent.removeEventListener('touchstart', handleTouchStart);
      mainContent.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, isMobile, cinematicsMode, bookingMode, moduleZoom]);

  // Hash-based deep linking → opens modules instead of tabs
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      const hashToModule: Record<string, string> = {
        '#book': 'book-meeting',
        '#consultation': 'book-meeting',
        '#meeting': 'book-meeting',
        '#offer': 'the-offer',
        '#about': 'meet-salman',
        '#meet': 'meet-salman',
      };

      if (hash && hashToModule[hash]) {
        setActiveTab('overview');
        setOpenModuleId(hashToModule[hash]);
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

  const handleHome = () => {
    setActiveTab('overview');
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
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
      case 'overview':
        return (
          <Hero
            onStart={() => {}}
            onConsultation={() => setOpenModuleId('book-meeting')}
            onViewCinematics={() => setCinematicsMode(true)}
            onBookNow={() => setBookingMode(true)}
            cinematicsMode={cinematicsMode}
            bookingMode={bookingMode}
            scrollProgress={scrollProgress}
            scrollDirection={scrollDirection}
            smoothMouse={smoothMouse}
          />
        );
      case 'dashboard':
        if (!currentUser) return null;
        return <Dashboard user={currentUser} />;
      default:
        return (
          <Hero
            onStart={() => {}}
            onConsultation={() => setOpenModuleId('book-meeting')}
            onViewCinematics={() => setCinematicsMode(true)}
            onBookNow={() => setBookingMode(true)}
            cinematicsMode={cinematicsMode}
            bookingMode={bookingMode}
            scrollProgress={scrollProgress}
            scrollDirection={scrollDirection}
            smoothMouse={smoothMouse}
          />
        );
    }
  };

  // Full-page onboarding takeover
  if (currentUser && currentUser.role === 'client' && !currentUser.hasCompletedOnboarding) {
    return <ClientHubOnboarding user={currentUser} onComplete={refreshUser} />;
  }

  return (
    <div className="relative h-screen w-screen flex flex-col bg-black overflow-hidden selection:bg-[#CCFF00] selection:text-black font-body noise-overlay">

      {/* Module Manager - renders 3D room + floating module panels (desktop only) */}
      {!isMobile && (
        <ModuleManager
          scrollProgress={activeTab === 'overview' ? scrollProgress : 1}
          smoothMouse={smoothMouse}
          onConsultation={() => setOpenModuleId('book-meeting')}
          cinematicsMode={cinematicsMode}
          onCloseCinematics={() => setCinematicsMode(false)}
          bookingMode={bookingMode}
          onCloseBooking={() => setBookingMode(false)}
          onZoomChange={setModuleZoom}
          openModuleId={openModuleId}
          onOpenModuleIdConsumed={() => setOpenModuleId(null)}
        />
      )}

      <GlassHeader
        onAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onNavigate={handleNavigation}
        scrollProgress={activeTab === 'overview' ? scrollProgress : 1}
        scrollDirection={activeTab === 'overview' ? scrollDirection : 'forward'}
        moduleZoom={moduleZoom}
      />

      <main id="main-content" className={`flex-1 overflow-x-hidden relative p-4 sm:p-6 lg:p-12 lg:pb-32 pb-28 pt-24 lg:pt-28 ${cinematicsMode || bookingMode || moduleZoom > 0 ? 'overflow-y-hidden' : 'overflow-y-auto'}`}>
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
        onHome={handleHome}
        onAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onLogout={handleLogout}
        onDashboard={currentUser ? () => handleNavigation('dashboard') : undefined}
        scrollProgress={activeTab === 'overview' ? scrollProgress : 1}
        scrollDirection={activeTab === 'overview' ? scrollDirection : 'forward'}
        moduleZoom={moduleZoom}
      />
    </div>
  );
};

export default App;
