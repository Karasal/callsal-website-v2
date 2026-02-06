import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ModuleMetadata } from '../types/modules';

interface Module3DOverlayProps {
  modules: ModuleMetadata[];
  selectedModuleId: string;
  scrollProgress: number;
  smoothMouse: { x: number; y: number };
  onSelectModule: (id: string) => void;
  onConsultation: () => void;
}

// Single centered panel (preview + selector bar combined)
const PREVIEW_POS = { x: 0, y: 3.5, z: 6.5 };
const PREVIEW_SIZE = { w: 6.0, h: 3.5 };
const CONTENT_BASE_WIDTH = 1600;

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

// Horizontal selector bar component
const SelectorBar: React.FC<{
  modules: ModuleMetadata[];
  selectedModuleId: string;
  onSelectModule: (id: string) => void;
  compact?: boolean;
}> = ({ modules, selectedModuleId, onSelectModule, compact = false }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(24);

  useEffect(() => {
    const activeIndex = modules.findIndex(m => m.id === selectedModuleId);
    const activeItem = itemRefs.current[activeIndex];
    const container = barRef.current;

    if (activeItem && container) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      setIndicatorLeft(itemRect.left - containerRect.left + itemRect.width / 2 - 12);
      setIndicatorWidth(24);
    }
  }, [selectedModuleId, modules]);

  return (
    <div ref={barRef} className="relative flex items-center justify-center gap-1" style={{ padding: compact ? '6px 8px' : '8px 12px' }}>
      {/* Horizontal gradient indicator */}
      <motion.div
        className="absolute bottom-0 rounded-t-full z-10"
        initial={false}
        animate={{ left: indicatorLeft }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          width: indicatorWidth,
          height: 3,
          background: 'linear-gradient(90deg, #CCFF00, #00F0FF)',
          boxShadow: '0 0 8px rgba(204, 255, 0, 0.5)',
        }}
      />

      {modules.map((module, index) => {
        const isSelected = selectedModuleId === module.id;
        return (
          <button
            key={module.id}
            ref={(el) => { itemRefs.current[index] = el; }}
            onClick={() => onSelectModule(module.id)}
            className="flex items-center gap-1.5 transition-all whitespace-nowrap"
            style={{
              padding: compact ? '4px 8px' : '4px 10px',
              color: isSelected ? '#CCFF00' : 'rgba(255,255,255,0.5)',
              fontSize: compact ? '9px' : '11px',
            }}
          >
            <span className="shrink-0" style={{ fontSize: compact ? '10px' : '12px' }}>{module.icon}</span>
            <span className="font-display font-bold uppercase tracking-tight leading-none">
              {module.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export const Module3DOverlay: React.FC<Module3DOverlayProps> = ({
  modules,
  selectedModuleId,
  scrollProgress,
  smoothMouse,
  onSelectModule,
  onConsultation,
}) => {
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 1080;

  const selectedModule = modules.find(m => m.id === selectedModuleId);

  // Track whether mouse is over the panel (for scroll behavior)
  const [isHoveringPanel, setIsHoveringPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [moduleReady, setModuleReady] = useState(true);

  // Expose hover state to parent via data attribute on body
  useEffect(() => {
    document.body.dataset.modulePanelHover = isHoveringPanel ? 'true' : 'false';
    return () => { delete document.body.dataset.modulePanelHover; };
  }, [isHoveringPanel]);

  // On module switch: hide content, scroll to top, then reveal
  useEffect(() => {
    setModuleReady(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    requestAnimationFrame(() => {
      setModuleReady(true);
    });
  }, [selectedModuleId]);

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

  // Calculate panel position
  const previewTransform = useMemo(() =>
    projectPanel(PREVIEW_POS, PREVIEW_SIZE, screenW, screenH, cameraState.camX, cameraState.camY, cameraState.camZ, cameraState.panAngle, cameraState.tiltAngle),
    [cameraState, screenW, screenH]
  );

  // Fix scroll height: transform:scale doesn't affect layout, so we correct via direct DOM
  const updateContentMargin = useCallback(() => {
    const el = contentRef.current;
    if (!el || !previewTransform) return;
    const h = el.scrollHeight;
    const scale = previewTransform.width / CONTENT_BASE_WIDTH;
    if (h > 0 && scale < 1) {
      el.style.marginBottom = `${-(h * (1 - scale))}px`;
    }
  }, [previewTransform]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    updateContentMargin();
    const raf = requestAnimationFrame(updateContentMargin);
    const observer = new ResizeObserver(updateContentMargin);
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [selectedModuleId, moduleReady, updateContentMargin]);

  // Panel visibility — fade in from scrollProgress 0.8 to 1.0
  const panelsVisible = scrollProgress >= 0.8;
  const panelOpacity = panelsVisible ? Math.min(1, (scrollProgress - 0.8) * 5) : 0;

  return (
    <>
      {panelOpacity > 0 && (
        <div
          className="fixed inset-0 z-[50]"
          style={{ perspective: '2000px', pointerEvents: 'none', opacity: panelOpacity }}
        >
          {previewTransform && selectedModule && (<>
            <div
              ref={panelRef}
              className="absolute module-3d-panel"
              onMouseEnter={() => setIsHoveringPanel(true)}
              onMouseLeave={() => setIsHoveringPanel(false)}
              style={{
                left: previewTransform.x - previewTransform.width / 2,
                top: previewTransform.y - previewTransform.height / 2,
                width: previewTransform.width,
                height: previewTransform.height,
                transform: `rotateY(${previewTransform.rotateY * 0.3}deg) rotateX(${previewTransform.rotateX * 0.3}deg)`,
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                zIndex: 60,
                boxShadow: '0 10px 60px rgba(204,255,0,0.08), 0 4px 20px rgba(0,240,255,0.06)',
                borderRadius: 12,
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.95)',
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Scrollable content area */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar"
                style={{ minHeight: 0 }}
              >
                <div
                  ref={contentRef}
                  style={{
                    width: CONTENT_BASE_WIDTH,
                    transform: `scale(${previewTransform.width / CONTENT_BASE_WIDTH})`,
                    transformOrigin: 'top left',
                    opacity: moduleReady ? 1 : 0,
                  }}
                >
                  <selectedModule.component
                    onClose={() => {}}
                    onConsultation={onConsultation}
                  />
                </div>
              </div>

              {/* Separator */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

              {/* Horizontal selector bar */}
              <div style={{ flexShrink: 0 }}>
                <SelectorBar
                  modules={modules}
                  selectedModuleId={selectedModuleId}
                  onSelectModule={onSelectModule}
                  compact={previewTransform.width < 500}
                />
              </div>

            </div>

            {/* Border beam — sibling outside panel transform, no 3D rotation glitch */}
            <div
              className="module-border-beam"
              style={{
                position: 'absolute',
                left: previewTransform.x - previewTransform.width / 2,
                top: previewTransform.y - previewTransform.height / 2,
                width: previewTransform.width,
                height: previewTransform.height,
              }}
            />
          </>)}
        </div>
      )}
    </>
  );
};

export default Module3DOverlay;
