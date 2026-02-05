import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ViewState,
  PageId,
  ModuleMetadata,
  ModuleContentProps,
  easeOutCubic,
} from '../types/modules';

// Import Room3DEnhanced for canvas-rendered 3D room
import { Room3DEnhanced } from './Room3DEnhanced';
// Import Module3DOverlay for HTML content positioned in 3D space
import { Module3DOverlay } from './Module3DOverlay';
// Import overlays
import { TVOverlay } from './TVOverlay';
import { BookingOverlay } from './BookingOverlay';
// Import actual module components
import { ArmoryModule } from './modules/ArmoryModule';
import { CinematicsModule } from './modules/CinematicsModule';

// Icons for module cards
const ArmoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const VideoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

// Module registry - defines all modules per page
// Room: camZ=2.0 at scroll=1.0, back wall at zFar=10.5
// Cards need z > camZ and z < zFar to be visible inside room
const createModuleRegistry = (): ModuleMetadata[] => [
  {
    id: 'armory',
    title: 'THE ARMORY',
    icon: <ArmoryIcon />,
    component: ArmoryModule,
    page: 'overview',
    basePosition: { x: -2.5, y: 3, z: 6.5 },
  },
  {
    id: 'video-portfolio',
    title: 'CINEMATICS',
    icon: <VideoIcon />,
    component: CinematicsModule,
    page: 'overview',
    basePosition: { x: 2.5, y: 3, z: 6.5 },
  },
];

interface ModuleManagerProps {
  scrollProgress: number;
  smoothMouse: { x: number; y: number };
  activeTab: PageId | string;
  onConsultation: () => void;
  cinematicsMode?: boolean;
  onCloseCinematics?: () => void;
  bookingMode?: boolean;
  onCloseBooking?: () => void;
  onZoomChange?: (zoomProgress: number) => void;
  openModuleId?: string | null;
  onOpenModuleIdConsumed?: () => void;
  onMeetSal?: () => void;
}

export const ModuleManager: React.FC<ModuleManagerProps> = ({
  scrollProgress,
  smoothMouse,
  activeTab,
  onConsultation,
  cinematicsMode = false,
  onCloseCinematics,
  bookingMode = false,
  onCloseBooking,
  onZoomChange,
  openModuleId = null,
  onOpenModuleIdConsumed,
  onMeetSal,
}) => {
  // State machine
  const [viewState, setViewState] = useState<ViewState>('diorama');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);
  const [zoomProgress, setZoomProgress] = useState(0);

  // Module registry
  const modules = createModuleRegistry();

  // Filter modules for current page
  const pageModules = modules.filter(m => m.page === activeTab);

  // Determine view state based on scroll progress and active module
  useEffect(() => {
    if (scrollProgress < 0.8) {
      setViewState('diorama');
    } else if (activeModuleId === null) {
      setViewState('floating');
    } else {
      setViewState('zoomed');
    }
  }, [scrollProgress, activeModuleId]);

  // Reset module selection when changing tabs
  useEffect(() => {
    setActiveModuleId(null);
    setHoveredModuleId(null);
    setZoomProgress(0);
  }, [activeTab]);

  // Animate zoom progress when activeModuleId changes
  const zoomAnimationRef = useRef<number | null>(null);
  const zoomProgressRef = useRef(zoomProgress);

  useEffect(() => {
    zoomProgressRef.current = zoomProgress;
    onZoomChange?.(zoomProgress);
  }, [zoomProgress, onZoomChange]);

  useEffect(() => {
    if (zoomAnimationRef.current) {
      cancelAnimationFrame(zoomAnimationRef.current);
    }

    const targetZoom = activeModuleId !== null ? 1 : 0;
    const startZoom = zoomProgressRef.current;
    const duration = 300; // ms - fast, snappy animation
    let startTime: number | null = null;

    // Faster ease-out for instant feel
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(rawProgress);

      const newZoom = startZoom + (targetZoom - startZoom) * easedProgress;
      setZoomProgress(newZoom);

      if (rawProgress < 1) {
        zoomAnimationRef.current = requestAnimationFrame(animate);
      } else {
        zoomAnimationRef.current = null;
      }
    };

    zoomAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (zoomAnimationRef.current) {
        cancelAnimationFrame(zoomAnimationRef.current);
      }
    };
  }, [activeModuleId]);

  // Handlers
  const handleModuleClick = useCallback((id: string) => {
    setActiveModuleId(id);
  }, []);

  const handleModuleHover = useCallback((id: string | null) => {
    setHoveredModuleId(id);
  }, []);

  const handleCloseModule = useCallback(() => {
    setActiveModuleId(null);
  }, []);

  // Open module when openModuleId is set and we've scrolled to modules
  useEffect(() => {
    if (openModuleId && scrollProgress >= 0.8 && activeModuleId !== openModuleId) {
      setActiveModuleId(openModuleId);
      onOpenModuleIdConsumed?.();
    }
  }, [openModuleId, scrollProgress, activeModuleId, onOpenModuleIdConsumed]);

  return (
    <>
      {/* Room3DEnhanced renders the 3D room + card FRAMES only (no content) */}
      <Room3DEnhanced
        scrollProgress={scrollProgress}
        smoothMouse={smoothMouse}
        modules={pageModules}
        viewState={viewState}
        activeModuleId={activeModuleId}
        hoveredModuleId={hoveredModuleId}
        zoomProgress={zoomProgress}
        onModuleClick={handleModuleClick}
        onModuleHover={handleModuleHover}
        cinematicsMode={cinematicsMode || bookingMode}
      />

      {/* Module3DOverlay renders actual HTML content positioned in 3D space */}
      <Module3DOverlay
        modules={pageModules}
        viewState={viewState}
        activeModuleId={activeModuleId}
        hoveredModuleId={hoveredModuleId}
        zoomProgress={zoomProgress}
        scrollProgress={scrollProgress}
        smoothMouse={smoothMouse}
        onModuleClick={handleModuleClick}
        onModuleHover={handleModuleHover}
        onClose={handleCloseModule}
        onConsultation={onConsultation}
        onMeetSal={onMeetSal}
      />

      {/* TVOverlay - flip animation from diorama to video player */}
      <TVOverlay
        isActive={cinematicsMode}
        onClose={onCloseCinematics || (() => {})}
        scrollProgress={scrollProgress}
        smoothMouse={smoothMouse}
      />

      {/* BookingOverlay - floating booking panel */}
      <BookingOverlay
        isActive={bookingMode}
        onClose={onCloseBooking || (() => {})}
        scrollProgress={scrollProgress}
        smoothMouse={smoothMouse}
      />
    </>
  );
};

export default ModuleManager;
