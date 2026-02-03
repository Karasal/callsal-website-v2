import { useState, useEffect } from 'react';

/**
 * Hook to disable entrance animations on mobile devices
 * Returns props/variants that disable all fade/slide/scale animations on mobile
 * while keeping them intact on desktop
 */
export function useMobileAnimations() {
  // Initialize correctly to avoid flash on mobile
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(pointer: coarse)').matches;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };
    // Re-check in case SSR value was wrong
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Props that disable entrance animations on mobile
  const getMotionProps = (desktopProps: {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    whileInView?: any;
    viewport?: any;
  }) => {
    if (isMobile) {
      return {
        initial: false,
        animate: undefined,
        exit: undefined,
        transition: { duration: 0 },
        whileInView: undefined,
        viewport: undefined,
      };
    }
    return desktopProps;
  };

  // Variants that do nothing on mobile
  const getVariants = (desktopVariants: { hidden?: any; visible?: any }) => {
    if (isMobile) {
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { duration: 0 } },
      };
    }
    return desktopVariants;
  };

  // For page transitions - keeps opacity but makes it instant on mobile
  const pageTransitionProps = isMobile
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 } };

  // For modals - instant on mobile
  const modalProps = isMobile
    ? { initial: false, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, scale: 0.9, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, y: 20 } };

  // For simple fade modals/overlays
  const fadeProps = isMobile
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  // For whileInView animations - disable on mobile
  const getWhileInViewProps = (desktopProps: {
    initial?: any;
    whileInView?: any;
    viewport?: any;
    transition?: any;
  }) => {
    if (isMobile) {
      return {};
    }
    return desktopProps;
  };

  return {
    isMobile,
    getMotionProps,
    getVariants,
    pageTransitionProps,
    modalProps,
    fadeProps,
    getWhileInViewProps,
  };
}
