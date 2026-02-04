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
// Import actual module components
import { ArmoryModule } from './modules/ArmoryModule';

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

const SalMethodIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4l3 3" />
  </svg>
);

// Placeholder module for modules not yet built
const PlaceholderModule: React.FC<ModuleContentProps & { title: string }> = ({ onClose, title, isPreview }) => {
  if (isPreview) {
    return (
      <div className="w-full h-full bg-black/90 p-3 flex flex-col items-center justify-center">
        <h3 className="text-[10px] font-display font-bold text-white uppercase tracking-tight mb-2">{title}</h3>
        <p className="text-[6px] text-gray-400 uppercase">COMING SOON</p>
        <div className="mt-2 p-1.5 bg-[#CCFF00] rounded text-center">
          <p className="text-[6px] font-display font-bold text-black uppercase">CLICK TO EXPLORE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-display text-white mb-4">{title}</h2>
      <p className="text-gray-400">This module is coming soon.</p>
      <button onClick={onClose} className="mt-8 btn-primary">Close</button>
    </div>
  );
};

// Module registry - defines all modules per page
// Room: camZ=2.0 at scroll=1.0, back wall at zFar=10.5
// Cards need z > camZ and z < zFar to be visible inside room
const createModuleRegistry = (): ModuleMetadata[] => [
  {
    id: 'sal-method',
    title: 'THE SAL METHOD',
    icon: <SalMethodIcon />,
    component: (props: ModuleContentProps) => <PlaceholderModule {...props} title="THE SAL METHOD" />,
    page: 'overview',
    basePosition: { x: -4, y: 3, z: 6 },
  },
  {
    id: 'armory',
    title: 'THE ARMORY',
    icon: <ArmoryIcon />,
    component: ArmoryModule,
    page: 'overview',
    basePosition: { x: 0, y: 3, z: 7 },
  },
  {
    id: 'video-portfolio',
    title: 'CINEMATICS',
    icon: <VideoIcon />,
    component: (props: ModuleContentProps) => <PlaceholderModule {...props} title="CINEMATICS" />,
    page: 'overview',
    basePosition: { x: 4, y: 3, z: 6 },
  },
];

interface ModuleManagerProps {
  scrollProgress: number;
  smoothMouse: { x: number; y: number };
  activeTab: PageId | string;
  onConsultation: () => void;
}

export const ModuleManager: React.FC<ModuleManagerProps> = ({
  scrollProgress,
  smoothMouse,
  activeTab,
  onConsultation,
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
  }, [zoomProgress]);

  useEffect(() => {
    if (zoomAnimationRef.current) {
      cancelAnimationFrame(zoomAnimationRef.current);
    }

    const targetZoom = activeModuleId !== null ? 1 : 0;
    const startZoom = zoomProgressRef.current;
    const duration = 600; // ms
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(rawProgress);

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
      />
    </>
  );
};

export default ModuleManager;
