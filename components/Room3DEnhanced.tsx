import React, { useEffect, useRef, useCallback } from 'react';
import { ModuleMetadata, ViewState } from '../types/modules';

interface Room3DEnhancedProps {
  opacity?: number;
  scrollProgress?: number;
  smoothMouse?: { x: number; y: number };
  modules: ModuleMetadata[];
  viewState: ViewState;
  activeModuleId: string | null;
  hoveredModuleId: string | null;
  zoomProgress: number;
  onModuleClick: (id: string) => void;
  onModuleHover: (id: string | null) => void;
}

// Card dimensions in 3D space
const CARD_WIDTH = 3.5;
const CARD_HEIGHT = 2.2;

export const Room3DEnhanced: React.FC<Room3DEnhancedProps> = ({
  opacity = 1,
  scrollProgress = 1,
  smoothMouse: smoothMouseProp,
  modules,
  viewState,
  activeModuleId,
  hoveredModuleId,
  zoomProgress,
  onModuleClick,
  onModuleHover,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const scrollProgressRef = useRef(scrollProgress);
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const dioramaImageRef = useRef<HTMLImageElement | null>(null);
  const hoveredModuleIdRef = useRef<string | null>(null);
  const zoomProgressRef = useRef(zoomProgress);
  const activeModuleIdRef = useRef<string | null>(null);
  const targetModulePosRef = useRef<{ x: number; y: number; z: number } | null>(null);

  // Store projected card bounds for hit detection
  const cardBoundsRef = useRef<Map<string, { corners: { x: number; y: number }[] }>>(new Map());

  // Update refs when props change
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    if (smoothMouseProp) {
      smoothMouseRef.current = smoothMouseProp;
    }
  }, [smoothMouseProp]);

  useEffect(() => {
    hoveredModuleIdRef.current = hoveredModuleId;
  }, [hoveredModuleId]);

  useEffect(() => {
    zoomProgressRef.current = zoomProgress;
  }, [zoomProgress]);

  // Track active module and its position for camera targeting
  useEffect(() => {
    activeModuleIdRef.current = activeModuleId;
    if (activeModuleId) {
      const targetModule = modules.find(m => m.id === activeModuleId);
      if (targetModule) {
        targetModulePosRef.current = targetModule.basePosition;
      }
    }
  }, [activeModuleId, modules]);

  // Point-in-polygon test for hit detection
  const isPointInPolygon = useCallback((px: number, py: number, corners: { x: number; y: number }[]) => {
    let inside = false;
    for (let i = 0, j = corners.length - 1; i < corners.length; j = i++) {
      const xi = corners[i].x, yi = corners[i].y;
      const xj = corners[j].x, yj = corners[j].y;
      if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  }, []);

  // Find which module is under the mouse
  const getModuleUnderMouse = useCallback((x: number, y: number): string | null => {
    // Check cards in reverse order (front to back in terms of z-order)
    const bounds = cardBoundsRef.current;
    for (const [id, { corners }] of bounds) {
      if (isPointInPolygon(x, y, corners)) {
        return id;
      }
    }
    return null;
  }, [isPointInPolygon]);

  // Handle mouse move for hover detection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (viewState !== 'floating') return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const moduleId = getModuleUnderMouse(x, y);
      if (moduleId !== hoveredModuleIdRef.current) {
        onModuleHover(moduleId);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (viewState !== 'floating') return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const moduleId = getModuleUnderMouse(x, y);
      if (moduleId) {
        onModuleClick(moduleId);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [viewState, getModuleUnderMouse, onModuleClick, onModuleHover]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Load diorama image for picture frame
    const dioramaImg = new Image();
    dioramaImg.src = '/calgary-diorama.jpg';
    dioramaImg.onload = () => {
      dioramaImageRef.current = dioramaImg;
    };

    // 3D to 2D projection with 90 FOV
    const project = (x: number, y: number, z: number, w: number, h: number, camX: number, camY: number, camZ: number) => {
      const fov = Math.PI / 2;
      const scale = w / (2 * Math.tan(fov / 2));
      const dx = x - camX;
      const dy = y - camY;
      const dz = z - camZ;
      if (dz <= 0) return null;
      const screenX = w / 2 + (dx / dz) * scale;
      const screenY = h / 2 + (dy / dz) * scale;
      return { x: screenX, y: screenY };
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const sp = scrollProgressRef.current;
      const zp = zoomProgressRef.current;

      // Color transition
      const colorProgress = Math.min(1, Math.max(0, (sp - 0.7) * 3.33));
      const wallR = Math.round(255 * (1 - colorProgress));
      const wallG = Math.round(255 * (1 - colorProgress));
      const wallB = Math.round(255 * (1 - colorProgress));
      const wallColor = `rgb(${wallR}, ${wallG}, ${wallB})`;
      const lineGrey = Math.round(180 - (140 * colorProgress));
      const lineColor = `rgb(${lineGrey}, ${lineGrey}, ${lineGrey})`;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = wallColor;
      ctx.fillRect(0, 0, w, h);

      // Camera zoom from scroll
      const zoomProgress = Math.min(1, sp);
      const easeZoom = (1 - Math.cos(zoomProgress * Math.PI)) / 2;

      // Base camera position at full scroll
      const baseCamX = 0;
      const baseCamY = 2.5 + (3.5 - 2.5) * easeZoom;
      const baseCamZ = 7.5 + (2.0 - 7.5) * easeZoom;

      // When a module is active, fly camera TOWARD it smoothly
      let camX = baseCamX;
      let camY = baseCamY;
      let camZ = baseCamZ;

      if (targetModulePosRef.current && zp > 0) {
        const target = targetModulePosRef.current;
        // Smoothstep easing for natural drone movement
        const ease = zp * zp * (3 - 2 * zp);

        // Camera flies toward module — keep centered
        const targetCamX = target.x * 0.02; // Almost no X offset — stay centered
        const targetCamY = baseCamY;        // DON'T move Y — stay at current height
        const targetCamZ = target.z - 3.5;  // Stop 3.5 units in front

        camX = baseCamX + (targetCamX - baseCamX) * ease;
        camY = targetCamY; // Keep Y stable
        camZ = baseCamZ + (targetCamZ - baseCamZ) * ease;
      }

      // Camera rotation based on mouse — CONSTRAINED for subtle, clean movement
      const maxPan = 0.08 * easeZoom * (1 - zp); // Reduced from 0.3 for subtlety
      const maxTilt = 0.05 * easeZoom * (1 - zp); // Reduced from 0.2 for subtlety
      const panAngle = (smoothMouseRef.current.x - 0.5) * maxPan * 2;
      const tiltAngle = (smoothMouseRef.current.y - 0.5) * maxTilt * 2;

      // Rotation helper
      // Camera looks TOWARD the mouse (removed negative signs)
      const rotatePoint = (x: number, y: number, z: number) => {
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

        return { x: dx + camX, y: dy + camY, z: dz + camZ };
      };

      // Room dimensions
      const roomSize = 10;
      const halfSize = roomSize / 2;
      const zNear = 0.5;
      const zFar = 10.5;
      const gridDivisions = 10;

      // Draw line helper
      const drawLine3D = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
        const r1 = rotatePoint(x1, y1, z1);
        const r2 = rotatePoint(x2, y2, z2);
        const nearPlane = camZ + 0.1;

        let ax = r1.x, ay = r1.y, az = r1.z;
        let bx = r2.x, by = r2.y, bz = r2.z;

        const aInFront = az > nearPlane;
        const bInFront = bz > nearPlane;
        if (!aInFront && !bInFront) return;

        if (!aInFront && bInFront) {
          const t = (nearPlane - az) / (bz - az);
          ax = ax + t * (bx - ax);
          ay = ay + t * (by - ay);
          az = nearPlane;
        } else if (aInFront && !bInFront) {
          const t = (nearPlane - bz) / (az - bz);
          bx = bx + t * (ax - bx);
          by = by + t * (ay - by);
          bz = nearPlane;
        }

        const p1 = project(ax, ay, az, w, h, camX, camY, camZ);
        const p2 = project(bx, by, bz, w, h, camX, camY, camZ);
        if (!p1 || !p2) return;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(Math.round(p1.x) + 0.5, Math.round(p1.y) + 0.5);
        ctx.lineTo(Math.round(p2.x) + 0.5, Math.round(p2.y) + 0.5);
        ctx.stroke();
      };

      // Fill quad helper
      const fillQuad3D = (points: [number, number, number][], color: string) => {
        const rotated = points.map(p => rotatePoint(p[0], p[1], p[2]));
        const projected = rotated.map(p => project(p.x, p.y, p.z, w, h, camX, camY, camZ));
        if (projected.some(p => !p)) return;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(projected[0]!.x, projected[0]!.y);
        for (let i = 1; i < projected.length; i++) {
          ctx.lineTo(projected[i]!.x, projected[i]!.y);
        }
        ctx.closePath();
        ctx.fill();
      };

      // Draw room walls
      fillQuad3D([[-halfSize, -halfSize, zFar], [halfSize, -halfSize, zFar], [halfSize, halfSize, zFar], [-halfSize, halfSize, zFar]], wallColor);
      fillQuad3D([[-halfSize, halfSize, zNear], [halfSize, halfSize, zNear], [halfSize, halfSize, zFar], [-halfSize, halfSize, zFar]], wallColor);
      fillQuad3D([[-halfSize, -halfSize, zNear], [halfSize, -halfSize, zNear], [halfSize, -halfSize, zFar], [-halfSize, -halfSize, zFar]], wallColor);
      fillQuad3D([[-halfSize, -halfSize, zNear], [-halfSize, -halfSize, zFar], [-halfSize, halfSize, zFar], [-halfSize, halfSize, zNear]], wallColor);
      fillQuad3D([[halfSize, -halfSize, zNear], [halfSize, -halfSize, zFar], [halfSize, halfSize, zFar], [halfSize, halfSize, zNear]], wallColor);

      // Draw grid
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      const step = roomSize / gridDivisions;

      // Back wall grid
      for (let i = 1; i < gridDivisions; i++) {
        const pos = -halfSize + i * step;
        drawLine3D(pos, -halfSize, zFar, pos, halfSize, zFar);
        drawLine3D(-halfSize, pos, zFar, halfSize, pos, zFar);
      }

      // Floor grid
      for (let i = 1; i < gridDivisions; i++) {
        const pos = -halfSize + i * step;
        const zPos = zNear + i * step;
        drawLine3D(-halfSize, halfSize, zPos, halfSize, halfSize, zPos);
        drawLine3D(pos, halfSize, zNear, pos, halfSize, zFar);
      }

      // Ceiling grid
      for (let i = 1; i < gridDivisions; i++) {
        const pos = -halfSize + i * step;
        const zPos = zNear + i * step;
        drawLine3D(-halfSize, -halfSize, zPos, halfSize, -halfSize, zPos);
        drawLine3D(pos, -halfSize, zNear, pos, -halfSize, zFar);
      }

      // Left wall grid
      for (let i = 1; i < gridDivisions; i++) {
        const pos = -halfSize + i * step;
        const zPos = zNear + i * step;
        drawLine3D(-halfSize, -halfSize, zPos, -halfSize, halfSize, zPos);
        drawLine3D(-halfSize, pos, zNear, -halfSize, pos, zFar);
      }

      // Right wall grid
      for (let i = 1; i < gridDivisions; i++) {
        const pos = -halfSize + i * step;
        const zPos = zNear + i * step;
        drawLine3D(halfSize, -halfSize, zPos, halfSize, halfSize, zPos);
        drawLine3D(halfSize, pos, zNear, halfSize, pos, zFar);
      }

      // Corner edges
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 3;
      drawLine3D(-halfSize, -halfSize, zFar, -halfSize, halfSize, zFar);
      drawLine3D(halfSize, -halfSize, zFar, halfSize, halfSize, zFar);
      drawLine3D(-halfSize, -halfSize, zFar, halfSize, -halfSize, zFar);
      drawLine3D(-halfSize, halfSize, zFar, halfSize, halfSize, zFar);
      drawLine3D(-halfSize, -halfSize, zNear, -halfSize, -halfSize, zFar);
      drawLine3D(halfSize, -halfSize, zNear, halfSize, -halfSize, zFar);
      drawLine3D(-halfSize, halfSize, zNear, -halfSize, halfSize, zFar);
      drawLine3D(halfSize, halfSize, zNear, halfSize, halfSize, zFar);

      // Picture frame on back wall — fade out as we approach modules
      // Fade from 0.7 (hero) to 0.9 (just before modules)
      const frameOpacity = sp <= 0.7 ? 1 : Math.max(0, 1 - (sp - 0.7) / 0.2);

      if (dioramaImageRef.current && frameOpacity > 0) {
        const frameWidth = 4;
        const frameHeight = 2.5;
        const frameY = 2.5;
        const frameZ = zFar - 0.01;

        const frameCorners = [
          [-frameWidth/2, frameY - frameHeight/2, frameZ],
          [frameWidth/2, frameY - frameHeight/2, frameZ],
          [frameWidth/2, frameY + frameHeight/2, frameZ],
          [-frameWidth/2, frameY + frameHeight/2, frameZ],
        ];

        const rotatedCorners = frameCorners.map(([x, y, z]) => rotatePoint(x, y, z));
        const projectedCorners = rotatedCorners.map(p => project(p.x, p.y, p.z, w, h, camX, camY, camZ));

        if (projectedCorners.every(p => p !== null)) {
          const pc = projectedCorners as { x: number; y: number }[];

          ctx.save();
          ctx.globalAlpha = frameOpacity;
          ctx.beginPath();
          ctx.moveTo(pc[0].x, pc[0].y);
          ctx.lineTo(pc[1].x, pc[1].y);
          ctx.lineTo(pc[2].x, pc[2].y);
          ctx.lineTo(pc[3].x, pc[3].y);
          ctx.closePath();
          ctx.clip();

          const minX = Math.min(pc[0].x, pc[1].x, pc[2].x, pc[3].x);
          const maxX = Math.max(pc[0].x, pc[1].x, pc[2].x, pc[3].x);
          const minY = Math.min(pc[0].y, pc[1].y, pc[2].y, pc[3].y);
          const maxY = Math.max(pc[0].y, pc[1].y, pc[2].y, pc[3].y);

          ctx.drawImage(dioramaImageRef.current, minX, minY, maxX - minX, maxY - minY);
          ctx.restore();

          // Frame border with same opacity
          ctx.save();
          ctx.globalAlpha = frameOpacity;
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 8;
          ctx.lineCap = 'square';
          ctx.lineJoin = 'miter';
          ctx.beginPath();
          ctx.moveTo(pc[0].x, pc[0].y);
          ctx.lineTo(pc[1].x, pc[1].y);
          ctx.lineTo(pc[2].x, pc[2].y);
          ctx.lineTo(pc[3].x, pc[3].y);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
      }

      // Draw module card FRAMES only (content is rendered by Module3DOverlay)
      // This creates a subtle frame effect behind the HTML content
      if (sp >= 0.8 && zp < 0.5) {
        const cardOpacity = Math.min(1, (sp - 0.8) * 5) * (1 - zp * 2) * 0.3; // Subtle frame

        // Clear card bounds for this frame
        cardBoundsRef.current.clear();

        modules.forEach((module) => {
          const pos = module.basePosition;
          const isHovered = hoveredModuleIdRef.current === module.id;

          // Card corners in 3D space
          const halfW = CARD_WIDTH / 2;
          const halfH = CARD_HEIGHT / 2;
          const cardCorners = [
            [pos.x - halfW, pos.y - halfH, pos.z],
            [pos.x + halfW, pos.y - halfH, pos.z],
            [pos.x + halfW, pos.y + halfH, pos.z],
            [pos.x - halfW, pos.y + halfH, pos.z],
          ] as [number, number, number][];

          // Rotate and project corners
          const rotatedCorners = cardCorners.map(([x, y, z]) => rotatePoint(x, y, z));
          const projectedCorners = rotatedCorners.map(p => project(p.x, p.y, p.z, w, h, camX, camY, camZ));

          if (projectedCorners.every(p => p !== null)) {
            const pc = projectedCorners as { x: number; y: number }[];

            // Store bounds for hit detection (still needed)
            cardBoundsRef.current.set(module.id, { corners: pc });

            // Only draw a subtle shadow/frame behind the HTML content
            ctx.save();
            ctx.globalAlpha = cardOpacity;

            // Subtle shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 10;
            ctx.beginPath();
            ctx.moveTo(pc[0].x, pc[0].y);
            ctx.lineTo(pc[1].x, pc[1].y);
            ctx.lineTo(pc[2].x, pc[2].y);
            ctx.lineTo(pc[3].x, pc[3].y);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.restore();
          }
        });
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [modules, activeModuleId]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{
        opacity,
        // Canvas is visual only — HTML overlay handles clicks
        pointerEvents: 'none',
      }}
    />
  );
};

export default Room3DEnhanced;
