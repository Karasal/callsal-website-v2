import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileAnimations } from './hooks/useMobileAnimations';
import { User as IUser } from './types';
import { GlassHeader } from './components/GlassHeader';
import { GlassNav } from './components/GlassNav';
import { Hero } from './components/Hero';
import { ModuleManager } from './components/ModuleManager';
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
  const [cinematicsMode, setCinematicsMode] = useState(false);
  const [bookingMode, setBookingMode] = useState(false);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [moduleZoom, setModuleZoom] = useState(0);
  const { isMobile, pageTransitionProps } = useMobileAnimations();

  // Shared mouse state for 3D parallax (syncs Room3D canvas with CSS transforms)
  const [smoothMouse, setSmoothMouse] = useState({ x: 0.5, y: 0.5 });
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const mouseAnimationRef = useRef<number | null>(null);

  // Mouse tracking with smooth interpolation (shared between Room3D and Hero)
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

      // Only update React state if changed significantly (reduces re-renders)
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

  // Reset snap state when cinematicsMode changes or module closes
  const prevModuleZoomRef = useRef(0);
  useEffect(() => {
    isSnappingRef.current = false;
    snapTargetRef.current = null;
  }, [cinematicsMode, bookingMode]);

  useEffect(() => {
    // Reset snap state when module fully closes
    const wasOpen = prevModuleZoomRef.current > 0.5;
    const isClosed = moduleZoom < 0.1;

    if (wasOpen && isClosed) {
      isSnappingRef.current = false;
      snapTargetRef.current = null;
    }

    prevModuleZoomRef.current = moduleZoom;
  }, [moduleZoom]);

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
  // Three snap points: diorama (0) → hero text (0.7) → modules (1.0)
  useEffect(() => {
    if (activeTab !== 'overview' || isMobile) return;

    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const transitionZone = window.innerHeight * 1.5;
    const DELTA_THRESHOLD = 15; // Ignore micro-scrolls from trackpads

    // Three snap points - all snap to same hero position for consistency
    const SNAP_DIORAMA = 0;
    const SNAP_HERO = transitionZone * 0.7;  // scrollProgress = 0.7 (white room, black text)
    const SNAP_MODULES = transitionZone;      // scrollProgress = 1.0 (module cards)

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

    // Find which snap point we're closest to
    const getSnapZone = (scrollTop: number): 'diorama' | 'hero' | 'modules' => {
      const heroThreshold = SNAP_HERO * 0.5;
      const modulesThreshold = SNAP_HERO + (SNAP_MODULES - SNAP_HERO) * 0.5;

      if (scrollTop < heroThreshold) return 'diorama';
      if (scrollTop < modulesThreshold) return 'hero';
      return 'modules';
    };

    // Wheel handler on WINDOW (not mainContent) so it catches events over fixed overlays
    const handleWheel = (e: WheelEvent) => {
      // Don't intercept scroll when overlay or module is open
      if (cinematicsMode || bookingMode || moduleZoom > 0) return;

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

      e.preventDefault();
      const scrollingDown = e.deltaY > 0;
      const currentZone = getSnapZone(scrollTop);

      // Navigate between snap points
      if (scrollingDown) {
        if (currentZone === 'diorama') snapTo(SNAP_HERO);
        else if (currentZone === 'hero') snapTo(SNAP_MODULES);
        // At modules - stay (no further snap points)
      } else {
        if (currentZone === 'modules') snapTo(SNAP_HERO);
        else if (currentZone === 'hero') snapTo(SNAP_DIORAMA);
        // At diorama - already at top
      }
    };

    // Touch handling for tablets/touch-enabled laptops
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

      // Navigate between snap points (same logic as wheel)
      if (swipedDown) {
        if (currentZone === 'diorama') snapTo(SNAP_HERO);
        else if (currentZone === 'hero') snapTo(SNAP_MODULES);
      } else {
        if (currentZone === 'modules') snapTo(SNAP_HERO);
        else if (currentZone === 'hero') snapTo(SNAP_DIORAMA);
      }
    };

    // Listen on window to catch wheel events over fixed overlays (module cards, etc.)
    window.addEventListener('wheel', handleWheel, { passive: false });
    mainContent.addEventListener('touchstart', handleTouchStart, { passive: true });
    mainContent.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      mainContent.removeEventListener('touchstart', handleTouchStart);
      mainContent.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, isMobile, cinematicsMode, bookingMode, moduleZoom]);

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
      case 'overview': return <Hero onStart={() => handleNavigation('about')} onConsultation={() => handleNavigation('consultation')} onViewCinematics={() => setCinematicsMode(true)} onBookNow={() => setBookingMode(true)} cinematicsMode={cinematicsMode} bookingMode={bookingMode} scrollProgress={scrollProgress} scrollDirection={scrollDirection} smoothMouse={smoothMouse} />;
      case 'about': return <MeetSalman onNext={() => handleNavigation('offer')} onConsultation={() => handleNavigation('consultation')} />;
      case 'offer': return <TheOffer onConsultation={() => handleNavigation('consultation')} />;
      case 'consultation': return <BookingPage />;
      case 'dashboard':
        if (!currentUser) return null;
        return <Dashboard user={currentUser} />;
      default: return <Hero onStart={() => handleNavigation('about')} onConsultation={() => handleNavigation('consultation')} onViewCinematics={() => setCinematicsMode(true)} onBookNow={() => setBookingMode(true)} cinematicsMode={cinematicsMode} bookingMode={bookingMode} scrollProgress={scrollProgress} scrollDirection={scrollDirection} smoothMouse={smoothMouse} />;
    }
  };

  // Full-page onboarding takeover for clients who haven't completed it
  if (currentUser && currentUser.role === 'client' && !currentUser.hasCompletedOnboarding) {
    return <ClientHubOnboarding user={currentUser} onComplete={refreshUser} />;
  }

  return (
    <div className="relative h-screen w-screen flex flex-col bg-black overflow-hidden selection:bg-[#CCFF00] selection:text-black font-body noise-overlay">

      {/* Module Manager - renders 3D room + floating module cards (desktop only) */}
      {!isMobile && (
        <ModuleManager
          scrollProgress={activeTab === 'overview' ? scrollProgress : 1}
          smoothMouse={smoothMouse}
          activeTab={activeTab}
          onConsultation={() => handleNavigation('consultation')}
          cinematicsMode={cinematicsMode}
          onCloseCinematics={() => setCinematicsMode(false)}
          bookingMode={bookingMode}
          onCloseBooking={() => setBookingMode(false)}
          onZoomChange={setModuleZoom}
          openModuleId={openModuleId}
          onOpenModuleIdConsumed={() => setOpenModuleId(null)}
          onMeetSal={() => handleNavigation('about')}
        />
      )}

      {/* Gradient Scroll Progress Bar - disabled for new 3D module system */}
      {/* <div
        className="fixed top-0 left-0 h-[3px] z-[999]"
        style={{
          width: `${totalScrollProgress}%`,
          background: 'linear-gradient(90deg, #CCFF00 0%, #00F0FF 100%)',
          boxShadow: '0 0 10px rgba(204, 255, 0, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        }}
      /> */}

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
        activeTab={activeTab}
        setActiveTab={handleNavigation}
        onAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onLogout={handleLogout}
        scrollProgress={activeTab === 'overview' ? scrollProgress : 1}
        scrollDirection={activeTab === 'overview' ? scrollDirection : 'forward'}
        moduleZoom={moduleZoom}
      />
    </div>
  );
};

export default App;
