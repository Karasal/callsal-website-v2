import React, { useMemo } from 'react';
import { ModuleMetadata, ViewState } from '../types/modules';

interface Module3DOverlayProps {
  modules: ModuleMetadata[];
  viewState: ViewState;
  activeModuleId: string | null;
  hoveredModuleId: string | null;
  zoomProgress: number;
  scrollProgress: number;
  smoothMouse: { x: number; y: number };
  onModuleClick: (id: string) => void;
  onModuleHover: (id: string | null) => void;
  onClose: () => void;
  onConsultation: () => void;
  onMeetSal?: () => void;
}

// Card dimensions in 3D space (must match Room3DEnhanced)
const CARD_WIDTH = 3.5;
const CARD_HEIGHT = 2.2;

// 3D projection matching Room3DEnhanced exactly
const project3D = (
  x: number,
  y: number,
  z: number,
  screenW: number,
  screenH: number,
  camX: number,
  camY: number,
  camZ: number,
  panAngle: number,
  tiltAngle: number
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
  const depth = dz;

  return { x: screenX, y: screenY, depth };
};

export const Module3DOverlay: React.FC<Module3DOverlayProps> = ({
  modules,
  viewState,
  activeModuleId,
  hoveredModuleId,
  zoomProgress,
  scrollProgress,
  smoothMouse,
  onModuleClick,
  onModuleHover,
  onClose,
  onConsultation,
  onMeetSal
}) => {
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 1080;

  // Get active module
  const activeModule = activeModuleId ? modules.find(m => m.id === activeModuleId) : null;

  // Camera state for floating cards (no zoom animation needed now)
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

  // Calculate floating card positions
  const cardTransforms = useMemo(() => {
    return modules.map(module => {
      const pos = module.basePosition;
      const center = project3D(
        pos.x, pos.y, pos.z,
        screenW, screenH,
        cameraState.camX, cameraState.camY, cameraState.camZ,
        cameraState.panAngle, cameraState.tiltAngle
      );

      if (!center) return null;

      const halfW = CARD_WIDTH / 2;
      const halfH = CARD_HEIGHT / 2;

      const topLeft = project3D(
        pos.x - halfW, pos.y - halfH, pos.z,
        screenW, screenH,
        cameraState.camX, cameraState.camY, cameraState.camZ,
        cameraState.panAngle, cameraState.tiltAngle
      );

      const topRight = project3D(
        pos.x + halfW, pos.y - halfH, pos.z,
        screenW, screenH,
        cameraState.camX, cameraState.camY, cameraState.camZ,
        cameraState.panAngle, cameraState.tiltAngle
      );

      const bottomLeft = project3D(
        pos.x - halfW, pos.y + halfH, pos.z,
        screenW, screenH,
        cameraState.camX, cameraState.camY, cameraState.camZ,
        cameraState.panAngle, cameraState.tiltAngle
      );

      if (!topLeft || !topRight || !bottomLeft) return null;

      const projectedWidth = Math.sqrt(
        Math.pow(topRight.x - topLeft.x, 2) + Math.pow(topRight.y - topLeft.y, 2)
      );
      const projectedHeight = Math.sqrt(
        Math.pow(bottomLeft.x - topLeft.x, 2) + Math.pow(bottomLeft.y - topLeft.y, 2)
      );

      const rotateY = cameraState.panAngle * (180 / Math.PI) * -1;
      const rotateX = cameraState.tiltAngle * (180 / Math.PI);

      return {
        moduleId: module.id,
        x: center.x,
        y: center.y,
        width: projectedWidth,
        height: projectedHeight,
        depth: center.depth,
        rotateX,
        rotateY,
      };
    }).filter(Boolean);
  }, [modules, cameraState, screenW, screenH]);

  // Card visibility - fade out when modal opens
  const effectiveZoom = zoomProgress < 0.01 ? 0 : zoomProgress;
  const cardsVisible = scrollProgress >= 0.8 && effectiveZoom < 0.5;
  const cardOpacity = cardsVisible ? Math.min(1, (scrollProgress - 0.8) * 5) * (1 - effectiveZoom * 2) : 0;

  // Modal visibility - fade in when active
  const modalVisible = effectiveZoom > 0.3;
  const modalOpacity = Math.min(1, (effectiveZoom - 0.3) / 0.4);

  return (
    <>
      {/* Floating 3D cards - fade out when modal opens */}
      {cardOpacity > 0 && (
        <div
          className="fixed inset-0 z-[50]"
          style={{ perspective: '2000px', pointerEvents: 'none', opacity: cardOpacity }}
        >
          {cardTransforms.map(transform => {
            if (!transform) return null;
            const module = modules.find(m => m.id === transform.moduleId);
            if (!module) return null;

            const isHovered = hoveredModuleId === module.id;
            const contentScale = transform.width / 1000;

            return (
              <div
                key={module.id}
                className="absolute"
                onClick={() => onModuleClick(module.id)}
                onMouseEnter={() => onModuleHover(module.id)}
                onMouseLeave={() => onModuleHover(null)}
                style={{
                  left: transform.x - transform.width / 2,
                  top: transform.y - transform.height / 2,
                  width: transform.width,
                  height: transform.height,
                  transform: `
                    rotateY(${transform.rotateY * 0.3}deg)
                    rotateX(${transform.rotateX * 0.3}deg)
                  `,
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                  zIndex: Math.round(100 - transform.depth * 10),
                  boxShadow: isHovered
                    ? '0 0 40px rgba(204, 255, 0, 0.6), 0 0 80px rgba(204, 255, 0, 0.3)'
                    : '0 10px 40px rgba(0,0,0,0.5)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: isHovered ? '2px solid #CCFF00' : '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.95)',
                  cursor: 'pointer',
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
                      transform: `scale(${contentScale})`,
                      transformOrigin: 'top center',
                    }}
                  >
                    <module.component
                      onClose={onClose}
                      onConsultation={onConsultation}
                      isPreview={false}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen modal - instant, no zoom animation */}
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
                    onClick={() => onModuleClick(prevModule.id)}
                    className="fixed left-6 top-1/2 -translate-y-1/2 z-[1001] w-12 h-12 flex items-center justify-center rounded-full bg-black/80 border border-white/20 hover:bg-[#CCFF00] hover:border-[#CCFF00] hover:text-black text-white transition-all"
                    title={prevModule.title}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onModuleClick(nextModule.id)}
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

            {/* Module content - natural size, no scaling */}
            <div
              className="w-full max-w-5xl mx-auto my-8 bg-black/95 rounded-2xl border border-white/10 overflow-hidden"
              style={{ minHeight: '80vh' }}
            >
              <activeModule.component
                onClose={onClose}
                onConsultation={onConsultation}
                isPreview={false}
              />

              {/* Meet Sal CTA */}
              {onMeetSal && (
                <div className="px-6 lg:px-8 pb-8">
                  <div className="border-t border-white/10 pt-8 text-center">
                    <span className="text-[10px] font-body tracking-[0.5em] text-[#CCFF00] uppercase font-bold block mb-4">INDEPENDENT AI OPERATOR & FILMMAKER</span>
                    <h3 className="text-2xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-none mb-4">SO WHO IS THIS SAL GUY ANYWAY?</h3>
                    <p className="text-sm font-display font-medium text-gray-400 uppercase tracking-tight mb-6 max-w-xl mx-auto">
                      THE FACE BEHIND THE TECH. THE HUMAN BEHIND THE AUTOMATION. GET TO KNOW YOUR NEW BUSINESS PAL.
                    </p>
                    <button
                      onClick={() => { onClose(); onMeetSal(); }}
                      className="btn-glass px-8 py-4 text-xs tracking-[0.2em]"
                    >
                      MEET SALMAN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Module3DOverlay;
