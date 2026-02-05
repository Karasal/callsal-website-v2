import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ModuleMetadata, ViewState } from '../types/modules';

interface Module3DOverlayProps {
  modules: ModuleMetadata[];
  viewState: ViewState;
  selectedModuleId: string;
  activeModuleId: string | null;
  zoomProgress: number;
  scrollProgress: number;
  smoothMouse: { x: number; y: number };
  onSelectModule: (id: string) => void;
  onOpenModule: () => void;
  onOpenModuleById: (id: string) => void;
  onClose: () => void;
  onConsultation: () => void;
}

// 3D positions for the two panels
const PREVIEW_POS = { x: -1.0, y: 3, z: 6.5 };
const PREVIEW_SIZE = { w: 5.0, h: 3.0 };
const SELECTOR_POS = { x: 3.5, y: 3, z: 6.5 };
const SELECTOR_SIZE = { w: 2.0, h: 3.0 };

// 3D projection matching Room3DEnhanced exactly
const project3D = (
  x: number, y: number, z: number,
  screenW: number, screenH: number,
  camX: number, camY: number, camZ: number,
  panAngle: number, tiltAngle: number
) => {
  let dx = x - camX;
  let dy = y - camY;
  let dz = z - camZ;

  const cosP = Math.cos(panAngle);
  const sinP = Math.sin(panAngle);
  const rx = dx * cosP - dz * sinP;
  const rz = dx * sinP + dz * cosP;
  dx = rx;
  dz = rz;

  const cosT = Math.cos(tiltAngle);
  const sinT = Math.sin(tiltAngle);
  const ry = dy * cosT - dz * sinT;
  const rz2 = dy * sinT + dz * cosT;
  dy = ry;
  dz = rz2;

  if (dz <= 0) return null;

  const fov = Math.PI / 2;
  const scale = screenW / (2 * Math.tan(fov / 2));
  const screenX = screenW / 2 + (dx / dz) * scale;
  const screenY = screenH / 2 + (dy / dz) * scale;

  return { x: screenX, y: screenY, depth: dz };
};

// Calculate projected rectangle from 3D position and size
const projectPanel = (
  pos: { x: number; y: number; z: number },
  size: { w: number; h: number },
  screenW: number, screenH: number,
  camX: number, camY: number, camZ: number,
  panAngle: number, tiltAngle: number
) => {
  const center = project3D(pos.x, pos.y, pos.z, screenW, screenH, camX, camY, camZ, panAngle, tiltAngle);
  if (!center) return null;

  const halfW = size.w / 2;
  const halfH = size.h / 2;

  const topLeft = project3D(pos.x - halfW, pos.y - halfH, pos.z, screenW, screenH, camX, camY, camZ, panAngle, tiltAngle);
  const topRight = project3D(pos.x + halfW, pos.y - halfH, pos.z, screenW, screenH, camX, camY, camZ, panAngle, tiltAngle);
  const bottomLeft = project3D(pos.x - halfW, pos.y + halfH, pos.z, screenW, screenH, camX, camY, camZ, panAngle, tiltAngle);

  if (!topLeft || !topRight || !bottomLeft) return null;

  const width = Math.sqrt(Math.pow(topRight.x - topLeft.x, 2) + Math.pow(topRight.y - topLeft.y, 2));
  const height = Math.sqrt(Math.pow(bottomLeft.x - topLeft.x, 2) + Math.pow(bottomLeft.y - topLeft.y, 2));

  const rotateY = panAngle * (180 / Math.PI) * -1;
  const rotateX = tiltAngle * (180 / Math.PI);

  return { x: center.x, y: center.y, width, height, depth: center.depth, rotateX, rotateY };
};

export const Module3DOverlay: React.FC<Module3DOverlayProps> = ({
  modules,
  viewState,
  selectedModuleId,
  activeModuleId,
  zoomProgress,
  scrollProgress,
  smoothMouse,
  onSelectModule,
  onOpenModule,
  onOpenModuleById,
  onClose,
  onConsultation,
}) => {
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 1080;

  // Indicator animation state
  const [indicatorTop, setIndicatorTop] = useState(0);
  const selectorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Update indicator position when selected module changes
  useEffect(() => {
    const activeIndex = modules.findIndex(m => m.id === selectedModuleId);
    const activeItem = itemRefs.current[activeIndex];
    const container = selectorRef.current;

    if (activeItem && container) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      setIndicatorTop(itemRect.top - containerRect.top + itemRect.height / 2 - 12);
    }
  }, [selectedModuleId, modules]);

  // Get active module for fullscreen
  const activeModule = activeModuleId ? modules.find(m => m.id === activeModuleId) : null;
  const selectedModule = modules.find(m => m.id === selectedModuleId);

  // Camera state for panel positioning
  const cameraState = useMemo(() => {
    const sp = scrollProgress;
    const zoomProgress2 = Math.min(1, sp);
    const easeZoom = (1 - Math.cos(zoomProgress2 * Math.PI)) / 2;

    const baseCamX = 0;
    const baseCamY = 2.5 + (3.5 - 2.5) * easeZoom;
    const baseCamZ = 7.5 + (2.0 - 7.5) * easeZoom;

    const maxPan = 0.08 * easeZoom;
    const maxTilt = 0.05 * easeZoom;
    const panAngle = (smoothMouse.x - 0.5) * maxPan * 2;
    const tiltAngle = (smoothMouse.y - 0.5) * maxTilt * 2;

    return { camX: baseCamX, camY: baseCamY, camZ: baseCamZ, panAngle, tiltAngle };
  }, [scrollProgress, smoothMouse]);

  // Calculate panel positions
  const previewTransform = useMemo(() =>
    projectPanel(PREVIEW_POS, PREVIEW_SIZE, screenW, screenH, cameraState.camX, cameraState.camY, cameraState.camZ, cameraState.panAngle, cameraState.tiltAngle),
    [cameraState, screenW, screenH]
  );

  const selectorTransform = useMemo(() =>
    projectPanel(SELECTOR_POS, SELECTOR_SIZE, screenW, screenH, cameraState.camX, cameraState.camY, cameraState.camZ, cameraState.panAngle, cameraState.tiltAngle),
    [cameraState, screenW, screenH]
  );

  // Visibility
  const effectiveZoom = zoomProgress < 0.01 ? 0 : zoomProgress;
  const panelsVisible = scrollProgress >= 0.8 && effectiveZoom < 0.5;
  const panelOpacity = panelsVisible ? Math.min(1, (scrollProgress - 0.8) * 5) * (1 - effectiveZoom * 2) : 0;

  // Modal visibility
  const modalVisible = effectiveZoom > 0.3;
  const modalOpacity = Math.min(1, (effectiveZoom - 0.3) / 0.4);

  return (
    <>
      {/* Floating 3D panels */}
      {panelOpacity > 0 && (
        <div
          className="fixed inset-0 z-[50]"
          style={{ perspective: '2000px', pointerEvents: 'none', opacity: panelOpacity }}
        >
          {/* Panel A: Module Preview */}
          {previewTransform && selectedModule && (
            <div
              className="absolute cursor-pointer"
              onClick={onOpenModule}
              style={{
                left: previewTransform.x - previewTransform.width / 2,
                top: previewTransform.y - previewTransform.height / 2,
                width: previewTransform.width,
                height: previewTransform.height,
                transform: `rotateY(${previewTransform.rotateY * 0.3}deg) rotateX(${previewTransform.rotateX * 0.3}deg)`,
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                zIndex: 60,
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.95)',
                pointerEvents: 'auto',
              }}
            >
              <div
                className="absolute inset-0 flex items-start justify-center overflow-hidden"
                style={{ pointerEvents: 'none' }}
              >
                <div
                  style={{
                    width: 1000,
                    height: 'auto',
                    minHeight: 700,
                    transform: `scale(${previewTransform.width / 1000})`,
                    transformOrigin: 'top center',
                  }}
                >
                  <selectedModule.component
                    onClose={onClose}
                    onConsultation={onConsultation}
                    isPreview={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Panel B: Module Selector */}
          {selectorTransform && (
            <div
              ref={selectorRef}
              className="absolute"
              style={{
                left: selectorTransform.x - selectorTransform.width / 2,
                top: selectorTransform.y - selectorTransform.height / 2,
                width: selectorTransform.width,
                height: selectorTransform.height,
                transform: `rotateY(${selectorTransform.rotateY * 0.3}deg) rotateX(${selectorTransform.rotateX * 0.3}deg)`,
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                zIndex: 60,
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.95)',
                pointerEvents: 'auto',
              }}
            >
              {/* Gradient indicator bar */}
              <motion.div
                className="absolute left-0 w-[3px] h-6 rounded-r-full z-10"
                initial={false}
                animate={{ top: indicatorTop }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  background: 'linear-gradient(180deg, #CCFF00 0%, #00F0FF 100%)',
                  boxShadow: '0 0 8px rgba(204, 255, 0, 0.5)',
                }}
              />

              {/* Module list */}
              <div className="flex flex-col h-full py-2">
                {modules.map((module, index) => {
                  const isSelected = selectedModuleId === module.id;
                  // Scale text based on panel width
                  const scaleFactor = selectorTransform.width / 300;
                  const fontSize = Math.max(8, Math.min(11, 11 * scaleFactor));
                  const iconScale = Math.max(0.6, Math.min(1, scaleFactor));
                  const padding = Math.max(4, Math.min(12, 12 * scaleFactor));

                  return (
                    <button
                      key={module.id}
                      ref={(el) => { itemRefs.current[index] = el; }}
                      onClick={() => onSelectModule(module.id)}
                      className="flex items-center gap-2 text-left transition-all relative"
                      style={{
                        padding: `${padding}px ${padding * 1.5}px`,
                        color: isSelected ? '#CCFF00' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <span style={{ transform: `scale(${iconScale})`, transformOrigin: 'center' }} className="shrink-0">
                        {module.icon}
                      </span>
                      <span
                        className="font-display font-bold uppercase tracking-tight leading-none"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        {module.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen modal */}
      {modalVisible && activeModule && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[998] bg-black transition-opacity duration-200"
            style={{ opacity: modalOpacity * 0.85 }}
            onClick={onClose}
          />

          {/* Modal container */}
          <div
            className="fixed inset-0 z-[999] flex items-start justify-center overflow-y-auto no-scrollbar transition-opacity duration-200"
            style={{ opacity: modalOpacity }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="fixed top-6 right-6 z-[1001] w-12 h-12 flex items-center justify-center rounded-full bg-black/80 border border-white/20 hover:bg-white/20 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation arrows */}
            {modules.length > 1 && (() => {
              const currentIndex = modules.findIndex(m => m.id === activeModuleId);
              const prevModule = modules[(currentIndex - 1 + modules.length) % modules.length];
              const nextModule = modules[(currentIndex + 1) % modules.length];

              return (
                <>
                  <button
                    onClick={() => onOpenModuleById(prevModule.id)}
                    className="fixed left-6 top-1/2 -translate-y-1/2 z-[1001] w-12 h-12 flex items-center justify-center rounded-full bg-black/80 border border-white/20 hover:bg-[#CCFF00] hover:border-[#CCFF00] hover:text-black text-white transition-all"
                    title={prevModule.title}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onOpenModuleById(nextModule.id)}
                    className="fixed right-6 top-1/2 -translate-y-1/2 z-[1001] w-12 h-12 flex items-center justify-center rounded-full bg-black/80 border border-white/20 hover:bg-[#CCFF00] hover:border-[#CCFF00] hover:text-black text-white transition-all"
                    title={nextModule.title}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              );
            })()}

            {/* Module content */}
            <div
              className="w-full max-w-5xl mx-auto my-8 bg-black/95 rounded-2xl border border-white/10 overflow-hidden"
              style={{ minHeight: '80vh' }}
            >
              <activeModule.component
                onClose={onClose}
                onConsultation={onConsultation}
                isPreview={false}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Module3DOverlay;
