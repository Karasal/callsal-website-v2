import React, { useEffect, useRef } from 'react';
import { ViewState } from '../types/modules';

interface Room3DEnhancedProps {
  opacity?: number;
  scrollProgress?: number;
  smoothMouse?: { x: number; y: number };
  viewState: ViewState;
  activeModuleId: string | null;
  zoomProgress: number;
  cinematicsMode?: boolean;
}

// Fixed panel position and size matching Module3DOverlay
const PREVIEW_POS = { x: 0, y: 3.5, z: 6.5 };
const PREVIEW_SIZE = { w: 6.0, h: 3.5 };

export const Room3DEnhanced: React.FC<Room3DEnhancedProps> = ({
  opacity = 1,
  scrollProgress = 1,
  smoothMouse: smoothMouseProp,
  viewState,
  activeModuleId,
  zoomProgress,
  cinematicsMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const scrollProgressRef = useRef(scrollProgress);
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const dioramaImageRef = useRef<HTMLImageElement | null>(null);
  const zoomProgressRef = useRef(zoomProgress);
  const cinematicsModeRef = useRef(cinematicsMode);

  useEffect(() => { scrollProgressRef.current = scrollProgress; }, [scrollProgress]);
  useEffect(() => { if (smoothMouseProp) smoothMouseRef.current = smoothMouseProp; }, [smoothMouseProp]);
  useEffect(() => { zoomProgressRef.current = zoomProgress; }, [zoomProgress]);
  useEffect(() => { cinematicsModeRef.current = cinematicsMode; }, [cinematicsMode]);

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
    dioramaImg.onload = () => { dioramaImageRef.current = dioramaImg; };

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
      const zoomProgress2 = Math.min(1, sp);
      const easeZoom = (1 - Math.cos(zoomProgress2 * Math.PI)) / 2;

      // Base camera position
      const baseCamX = 0;
      const baseCamY = 2.5 + (3.5 - 2.5) * easeZoom;
      const baseCamZ = 7.5 + (2.0 - 7.5) * easeZoom;

      // When a module is active, fly camera toward preview panel center
      let camX = baseCamX;
      let camY = baseCamY;
      let camZ = baseCamZ;

      if (zp > 0) {
        const ease = zp * zp * (3 - 2 * zp);
        const targetCamX = 0;
        const targetCamY = baseCamY;
        const targetCamZ = PREVIEW_POS.z - 3.5;

        camX = baseCamX + (targetCamX - baseCamX) * ease;
        camY = targetCamY;
        camZ = baseCamZ + (targetCamZ - baseCamZ) * ease;
      }

      // Camera rotation
      const maxPan = 0.08 * easeZoom * (1 - zp);
      const maxTilt = 0.05 * easeZoom * (1 - zp);
      const panAngle = (smoothMouseRef.current.x - 0.5) * maxPan * 2;
      const tiltAngle = (smoothMouseRef.current.y - 0.5) * maxTilt * 2;

      // Rotation helper
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

      // Picture frame on back wall
      const frameOpacity = sp <= 0.7 ? 1 : Math.max(0, 1 - (sp - 0.7) / 0.2);

      if (dioramaImageRef.current && frameOpacity > 0 && !cinematicsModeRef.current) {
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

          // Frame border
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

      // Draw centered panel frame shadow (behind HTML content)
      if (sp >= 0.8 && zp < 0.5) {
        const cardOpacity = Math.min(1, (sp - 0.8) * 5) * (1 - zp * 2) * 0.3;

        [{ pos: PREVIEW_POS, size: PREVIEW_SIZE }].forEach(({ pos, size }) => {
          const halfW = size.w / 2;
          const halfH = size.h / 2;
          const cardCorners = [
            [pos.x - halfW, pos.y - halfH, pos.z],
            [pos.x + halfW, pos.y - halfH, pos.z],
            [pos.x + halfW, pos.y + halfH, pos.z],
            [pos.x - halfW, pos.y + halfH, pos.z],
          ] as [number, number, number][];

          const rotatedCorners = cardCorners.map(([x, y, z]) => rotatePoint(x, y, z));
          const projectedCorners = rotatedCorners.map(p => project(p.x, p.y, p.z, w, h, camX, camY, camZ));

          if (projectedCorners.every(p => p !== null)) {
            const pc = projectedCorners as { x: number; y: number }[];

            ctx.save();
            ctx.globalAlpha = cardOpacity;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

export default Room3DEnhanced;
