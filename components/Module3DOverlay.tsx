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
  // Apply camera rotation
  let dx = x - camX;
  let dy = y - camY;
  let dz = z - camZ;

  // Pan (Y-axis rotation)
  const cosP = Math.cos(panAngle);
  const sinP = Math.sin(panAngle);
  const rx = dx * cosP - dz * sinP;
  const rz = dx * sinP + dz * cosP;
  dx = rx;
  dz = rz;

  // Tilt (X-axis rotation)
  const cosT = Math.cos(tiltAngle);
  const sinT = Math.sin(tiltAngle);
  const ry = dy * cosT - dz * sinT;
  const rz2 = dy * sinT + dz * cosT;
  dy = ry;
  dz = rz2;

  if (dz <= 0) return null;

  // Project to screen
  const fov = Math.PI / 2; // 90 degrees
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
  onConsultation
}) => {
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 1080;

  // Get target module position for camera targeting
  const targetModulePos = useMemo(() => {
    if (!activeModuleId) return null;
    const target = modules.find(m => m.id === activeModuleId);
    return target?.basePosition || null;
  }, [activeModuleId, modules]);

  // Calculate camera position (must match Room3DEnhanced exactly)
  const cameraState = useMemo(() => {
    const sp = scrollProgress;
    const zp = zoomProgress;

    // Camera zoom from scroll
    const zoomProgress2 = Math.min(1, sp);
    const easeZoom = (1 - Math.cos(zoomProgress2 * Math.PI)) / 2;

    // Base camera position at full scroll
    const baseCamX = 0;
    const baseCamY = 2.5 + (3.5 - 2.5) * easeZoom;
    const baseCamZ = 7.5 + (2.0 - 7.5) * easeZoom;

    // When a module is active, fly camera TOWARD it
    let camX = baseCamX;
    let camY = baseCamY;
    let camZ = baseCamZ;

    if (targetModulePos && zp > 0) {
      const ease = zp * zp * (3 - 2 * zp); // Smoothstep

      // Must match Room3DEnhanced exactly
      const targetCamX = targetModulePos.x * 0.02; // Almost no X offset — stay centered
      const targetCamY = baseCamY; // DON'T move Y — stay centered
      const targetCamZ = targetModulePos.z - 3.5;

      camX = baseCamX + (targetCamX - baseCamX) * ease;
      camY = targetCamY; // Keep Y stable
      camZ = baseCamZ + (targetCamZ - baseCamZ) * ease;
    }

    // Camera rotation from mouse — CONSTRAINED for subtle movement
    const maxPan = 0.08 * easeZoom * (1 - zp);
    const maxTilt = 0.05 * easeZoom * (1 - zp);
    const panAngle = (smoothMouse.x - 0.5) * maxPan * 2;
    const tiltAngle = (smoothMouse.y - 0.5) * maxTilt * 2;

    return { camX, camY, camZ, panAngle, tiltAngle, easeZoom };
  }, [scrollProgress, zoomProgress, smoothMouse, targetModulePos]);

  // Calculate card positions and sizes
  const cardTransforms = useMemo(() => {
    return modules.map(module => {
      const pos = module.basePosition;

      // Project card center
      const center = project3D(
        pos.x, pos.y, pos.z,
        screenW, screenH,
        cameraState.camX, cameraState.camY, cameraState.camZ,
        cameraState.panAngle, cameraState.tiltAngle
      );

      if (!center) return null;

      // Project corners to get apparent size
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

      // Calculate projected dimensions
      const projectedWidth = Math.sqrt(
        Math.pow(topRight.x - topLeft.x, 2) + Math.pow(topRight.y - topLeft.y, 2)
      );
      const projectedHeight = Math.sqrt(
        Math.pow(bottomLeft.x - topLeft.x, 2) + Math.pow(bottomLeft.y - topLeft.y, 2)
      );

      // Calculate rotation from perspective
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
        scale: 1 / center.depth * 3 // Depth-based scale factor
      };
    }).filter(Boolean);
  }, [modules, cameraState, screenW, screenH]);

  // Don't render overlays until cards should be visible
  const cardOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.8) * 5)) * (1 - zoomProgress * 2);

  if (cardOpacity <= 0 && zoomProgress <= 0) return null;

  // Get active module for fullscreen view
  const activeModule = activeModuleId ? modules.find(m => m.id === activeModuleId) : null;

  return (
    <>
      {/* 3D positioned cards — active card flies to fullscreen */}
      {/* Container has pointer-events-none so scrolling works through it */}
      {(cardOpacity > 0 || zoomProgress > 0) && (
        <div
          className="fixed inset-0 z-[50]"
          style={{ perspective: '2000px', pointerEvents: 'none' }}
        >
          {cardTransforms.map(transform => {
            if (!transform) return null;
            const module = modules.find(m => m.id === transform.moduleId);
            if (!module) return null;

            const isHovered = hoveredModuleId === module.id;
            const isActive = activeModuleId === module.id;

            // Non-active cards fade out
            const cardVisible = isActive ? 1 : cardOpacity * (1 - zoomProgress);
            if (cardVisible <= 0) return null;

            // Linear easing for clean, consistent scaling (no pop)
            const ease = zoomProgress;

            // Target: centered, smaller and cleaner
            const targetWidth = Math.min(screenW * 0.8, 1000);
            const targetHeight = screenH * 0.75;
            const targetX = screenW / 2;
            const targetY = screenH / 2;

            // Interpolate from 3D position to fullscreen (only for active card)
            const currentX = isActive
              ? transform.x + (targetX - transform.x) * ease
              : transform.x;
            const currentY = isActive
              ? transform.y + (targetY - transform.y) * ease
              : transform.y;
            const currentWidth = isActive
              ? transform.width + (targetWidth - transform.width) * ease
              : transform.width;
            const currentHeight = isActive
              ? transform.height + (targetHeight - transform.height) * ease
              : transform.height;

            // Rotation fades out for active card
            const rotationMultiplier = isActive ? (1 - ease) : 1;

            // Content scale based on current width
            const contentScale = currentWidth / 1000;

            // Enable interaction when mostly zoomed
            const isInteractive = isActive && zoomProgress > 0.7;

            return (
              <div
                key={module.id}
                className="absolute"
                style={{
                  left: currentX - currentWidth / 2,
                  top: currentY - currentHeight / 2,
                  width: currentWidth,
                  height: currentHeight,
                  opacity: cardVisible,
                  transform: `
                    rotateY(${transform.rotateY * 0.3 * rotationMultiplier}deg)
                    rotateX(${transform.rotateX * 0.3 * rotationMultiplier}deg)
                  `,
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                  zIndex: isActive ? 9999 : Math.round(1000 - transform.depth * 100),
                  boxShadow: isHovered && !isActive
                    ? '0 0 40px rgba(204, 255, 0, 0.6), 0 0 80px rgba(204, 255, 0, 0.3)'
                    : '0 10px 40px rgba(0,0,0,0.5)',
                  borderRadius: `${12 + ease * 12}px`,
                  overflow: isInteractive ? 'auto' : 'hidden',
                  border: isHovered && !isActive ? '2px solid #CCFF00' : '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.95)',
                  cursor: isActive ? 'default' : 'pointer',
                  // Cards don't block scroll — canvas handles clicks, this is just visual
                  // Only enable pointer-events when zoomed/active for scrolling content
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                {/* Close button when zoomed */}
                {isActive && zoomProgress > 0.3 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="absolute top-4 right-4 z-[100] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors pointer-events-auto"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Content — scales from center */}
                <div
                  className="absolute inset-0 flex items-start justify-center overflow-hidden"
                  style={{ pointerEvents: isInteractive ? 'auto' : 'none' }}
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

      {/* Backdrop dims when a module is zoomed */}
      {zoomProgress > 0 && (
        <div
          className="fixed inset-0 z-[40] bg-black pointer-events-auto"
          style={{ opacity: zoomProgress * 0.7 }}
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Module3DOverlay;
