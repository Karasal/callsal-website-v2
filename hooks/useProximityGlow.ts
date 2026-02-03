import React, { useState, useEffect, useRef, RefObject } from 'react';

/**
 * Hook for proximity-based glow effects
 * - Desktop: mouse proximity to element center (max glow at center, fades with distance)
 * - Mobile: scroll position (element distance from viewport center) - throttled for performance
 */
export function useProximityGlow(elementRef: RefObject<HTMLElement>, maxDistance = 400) {
  const [intensity, setIntensity] = useState(0);
  const isMobileRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastIntensityRef = useRef(0);

  // Detect mobile/touch device once on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.matchMedia('(pointer: coarse)').matches;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop: mouse proximity - throttled with RAF
  useEffect(() => {
    let pending = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobileRef.current || !elementRef.current || pending) return;

      pending = true;
      requestAnimationFrame(() => {
        if (!elementRef.current) {
          pending = false;
          return;
        }

        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );

        const newIntensity = Math.max(0, Math.min(1, 1 - distance / maxDistance));
        // Only update if changed significantly (reduces re-renders)
        if (Math.abs(newIntensity - lastIntensityRef.current) > 0.02) {
          lastIntensityRef.current = newIntensity;
          setIntensity(newIntensity);
        }
        pending = false;
      });
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Only reset if mouse truly left the document (relatedTarget is null)
      if (!isMobileRef.current && !e.relatedTarget) {
        lastIntensityRef.current = 0;
        setIntensity(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef, maxDistance]);

  // Mobile: static full glow (no scroll-based animation for performance)
  // Set intensity to 1 on mobile so everything looks glowy without the jank
  useEffect(() => {
    if (isMobileRef.current) {
      setIntensity(0.8); // Slightly less than max for subtle effect
    }
  }, []);

  // Generate glow style - works for dark text on light background
  const glowStyle = {
    textShadow: intensity > 0.05 ? `
      0 ${4 * intensity}px ${12 * intensity}px rgba(0, 240, 255, ${0.5 * intensity}),
      0 ${8 * intensity}px ${24 * intensity}px rgba(0, 240, 255, ${0.25 * intensity}),
      0 ${-4 * intensity}px ${12 * intensity}px rgba(204, 255, 0, ${0.4 * intensity}),
      0 ${-8 * intensity}px ${24 * intensity}px rgba(204, 255, 0, ${0.2 * intensity})
    ` : 'none',
    transition: 'text-shadow 0.2s ease-out',
  } as React.CSSProperties;

  return { intensity, glowStyle, isMobile: isMobileRef.current };
}
