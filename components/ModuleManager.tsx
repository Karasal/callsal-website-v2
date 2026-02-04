import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  ViewState,
  PageId,
  ModuleMetadata,
  ModuleContentProps,
  easeOutCubic,
} from '../types/modules';

// Import Room3DEnhanced for canvas-rendered modules
import { Room3DEnhanced } from './Room3DEnhanced';

// Icons for module cards (using simple shapes for now)
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

// Placeholder module components - will be replaced with extracted content
const PlaceholderModule: React.FC<ModuleContentProps & { title: string }> = ({ onClose, title }) => (
  <div className="p-8">
    <h2 className="text-3xl font-display text-white mb-4">{title}</h2>
    <p className="text-gray-400">Module content will be extracted here.</p>
    <button onClick={onClose} className="mt-8 btn-primary">Close</button>
  </div>
);

// Module registry - defines all modules per page
const createModuleRegistry = (): ModuleMetadata[] => [
  // Overview page modules
  // Room: camZ=2.0 at scroll=1.0, back wall at zFar=10.5
  // Cards need z > camZ and z < zFar to be visible inside room
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
    component: (props: ModuleContentProps) => <PlaceholderModule {...props} title="THE ARMORY" />,
    page: 'overview',
    basePosition: { x: 0, y: 3, z: 7 }, // Slight depth variation
  },
  {
    id: 'video-portfolio',
    title: 'CINEMATICS',
    icon: <VideoIcon />,
    component: (props: ModuleContentProps) => <PlaceholderModule {...props} title="CINEMATICS" />,
    page: 'overview',
    basePosition: { x: 4, y: 3, z: 6 },
  },
  // More pages will be added as we build them
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

  useEffect(() => {
    if (zoomAnimationRef.current) {
      cancelAnimationFrame(zoomAnimationRef.current);
    }

    const targetZoom = activeModuleId !== null ? 1 : 0;
    const startZoom = zoomProgress;
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

  // Get active module for zoom view
  const activeModule = activeModuleId
    ? modules.find(m => m.id === activeModuleId)
    : null;

  return (
    <>
      {/* Room3DEnhanced renders the 3D room + module cards in canvas */}
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

      {/* Zoomed module view */}
      <AnimatePresence>
        {activeModule && zoomProgress > 0 && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ opacity: zoomProgress }}
            onClick={handleCloseModule}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Module content panel */}
            <div
              className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto glass-strong rounded-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `scale(${0.9 + 0.1 * zoomProgress})`,
              }}
            >
              {/* Close button */}
              <button
                onClick={handleCloseModule}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Module content */}
              <activeModule.component
                onClose={handleCloseModule}
                onConsultation={onConsultation}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModuleManager;
