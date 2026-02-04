import React, { useEffect, useRef } from 'react';

interface Room3DProps {
  opacity?: number;
  scrollProgress?: number;
}

export const Room3D: React.FC<Room3DProps> = ({ opacity = 1, scrollProgress = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef<number>();
  const scrollProgressRef = useRef(scrollProgress);

  // Update ref when prop changes
  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMouse);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // 3D to 2D projection with 90 FOV
    const project = (x: number, y: number, z: number, w: number, h: number, camX: number, camY: number, camZ: number) => {
      const fov = Math.PI / 2; // 90 degrees
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

      smoothMouse.current.x = lerp(smoothMouse.current.x, mouseRef.current.x, 0.06);
      smoothMouse.current.y = lerp(smoothMouse.current.y, mouseRef.current.y, 0.06);

      // Scroll-driven animation progress
      const sp = scrollProgressRef.current;

      // Room becomes visible at sp=0.15, fully visible at sp~0.48
      // So remap our animations to start at 0.15 and complete by 0.85
      const adjustedProgress = Math.max(0, (sp - 0.15) / 0.7); // 0 at sp=0.15, 1 at sp=0.85

      // Color interpolation: white walls/dark grey grid → black walls/dark grey grid
      const colorProgress = Math.min(1, Math.max(0, adjustedProgress * 1.2)); // Complete by ~83% of adjusted range

      // Interpolate wall colors (white → black)
      const wallR = Math.round(255 * (1 - colorProgress));
      const wallG = Math.round(255 * (1 - colorProgress));
      const wallB = Math.round(255 * (1 - colorProgress));
      const wallColor = `rgb(${wallR}, ${wallG}, ${wallB})`;

      // Grid lines: dark grey (brutalist) - starts lighter, ends darker
      // Range from rgb(80,80,80) to rgb(40,40,40)
      const lineGrey = Math.round(80 - (40 * colorProgress));
      const lineColor = `rgb(${lineGrey}, ${lineGrey}, ${lineGrey})`;

      // Trace progress: lines draw in after room is visible
      // Lines start tracing at sp=0.15, fully drawn by sp=0.6
      const traceProgress = Math.min(1, Math.max(0, adjustedProgress * 1.5));

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = wallColor;
      ctx.fillRect(0, 0, w, h);

      // Camera position - fixed, centered, low near floor, inside the room
      const camX = 0;
      const camY = 3.8; // Low camera (floor is at y=5)
      const camZ = 1.2; // Inside the room, close to front (culled) face

      // Camera rotation (pan/tilt) based on mouse - fluid head movement
      const maxPan = 0.3;  // Max horizontal rotation in radians (~17 degrees)
      const maxTilt = 0.2; // Max vertical rotation in radians (~11 degrees)
      const panAngle = (smoothMouse.current.x - 0.5) * maxPan * 2;
      const tiltAngle = (smoothMouse.current.y - 0.5) * maxTilt * 2;

      // Rotation helper - rotate point around camera
      const rotatePoint = (x: number, y: number, z: number) => {
        // Translate to camera origin
        let dx = x - camX;
        let dy = y - camY;
        let dz = z - camZ;

        // Rotate around Y axis (pan/yaw)
        const cosP = Math.cos(-panAngle);
        const sinP = Math.sin(-panAngle);
        const rx = dx * cosP - dz * sinP;
        const rz = dx * sinP + dz * cosP;
        dx = rx;
        dz = rz;

        // Rotate around X axis (tilt/pitch)
        const cosT = Math.cos(-tiltAngle);
        const sinT = Math.sin(-tiltAngle);
        const ry = dy * cosT - dz * sinT;
        const rz2 = dy * sinT + dz * cosT;
        dy = ry;
        dz = rz2;

        return { x: dx + camX, y: dy + camY, z: dz + camZ };
      };

      // Room dimensions - cube where camera is inside near the front
      const roomSize = 10;
      const halfSize = roomSize / 2;
      const zNear = 0.5;  // Front face (culled - behind camera)
      const zFar = 10.5;  // Back wall we're looking at

      // Grid settings - 10 divisions for perfect squares
      const gridDivisions = 10;

      // Helper to draw a line in 3D with near-plane clipping and trace animation
      const drawLine3D = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, lineIndex: number = 0, totalLines: number = 1) => {
        // Apply camera rotation to both points
        const r1 = rotatePoint(x1, y1, z1);
        const r2 = rotatePoint(x2, y2, z2);

        const nearPlane = camZ + 0.1;

        // Clip line to near plane if needed
        let ax = r1.x, ay = r1.y, az = r1.z;
        let bx = r2.x, by = r2.y, bz = r2.z;

        const aInFront = az > nearPlane;
        const bInFront = bz > nearPlane;

        if (!aInFront && !bInFront) return; // Both behind camera

        if (!aInFront && bInFront) {
          // Clip point A to near plane
          const t = (nearPlane - az) / (bz - az);
          ax = ax + t * (bx - ax);
          ay = ay + t * (by - ay);
          az = nearPlane;
        } else if (aInFront && !bInFront) {
          // Clip point B to near plane
          const t = (nearPlane - bz) / (az - bz);
          bx = bx + t * (ax - bx);
          by = by + t * (ay - by);
          bz = nearPlane;
        }

        const p1 = project(ax, ay, az, w, h, camX, camY, camZ);
        const p2 = project(bx, by, bz, w, h, camX, camY, camZ);
        if (!p1 || !p2) return;

        // Calculate line length for trace animation
        const lineLength = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

        // Stagger the trace based on line index - lines draw in sequence
        const staggerOffset = (lineIndex / totalLines) * 0.5; // Spread over first 50% of trace
        const lineProgress = Math.min(1, Math.max(0, (traceProgress - staggerOffset) / 0.5));

        if (lineProgress <= 0) return; // Line hasn't started drawing yet

        // Solid lines with square caps for brutalist feel
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';

        // Trace animation - draw partial line based on progress
        const drawnLength = lineLength * lineProgress;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);

        // Calculate the point along the line at drawnLength
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const ratio = drawnLength / lineLength;
        const endX = p1.x + dx * ratio;
        const endY = p1.y + dy * ratio;

        ctx.lineTo(endX, endY);
        ctx.stroke();
      };

      // Helper to fill a quad in 3D
      const fillQuad3D = (points: [number, number, number][], color: string) => {
        // Apply camera rotation to all points, then project
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

      // Draw faces (back to front order) with dynamic wall color
      // Back wall
      fillQuad3D([
        [-halfSize, -halfSize, zFar],
        [halfSize, -halfSize, zFar],
        [halfSize, halfSize, zFar],
        [-halfSize, halfSize, zFar],
      ], wallColor);

      // Floor (y = halfSize = bottom)
      fillQuad3D([
        [-halfSize, halfSize, zNear],
        [halfSize, halfSize, zNear],
        [halfSize, halfSize, zFar],
        [-halfSize, halfSize, zFar],
      ], wallColor);

      // Ceiling (y = -halfSize = top)
      fillQuad3D([
        [-halfSize, -halfSize, zNear],
        [halfSize, -halfSize, zNear],
        [halfSize, -halfSize, zFar],
        [-halfSize, -halfSize, zFar],
      ], wallColor);

      // Left wall (x = -halfSize)
      fillQuad3D([
        [-halfSize, -halfSize, zNear],
        [-halfSize, -halfSize, zFar],
        [-halfSize, halfSize, zFar],
        [-halfSize, halfSize, zNear],
      ], wallColor);

      // Right wall (x = halfSize)
      fillQuad3D([
        [halfSize, -halfSize, zNear],
        [halfSize, -halfSize, zFar],
        [halfSize, halfSize, zFar],
        [halfSize, halfSize, zNear],
      ], wallColor);

      // Draw grid lines - thick brutalist style with trace animation
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;

      const step = roomSize / gridDivisions;

      // Total number of grid lines for stagger calculation
      // Back wall: 22, Floor: 22, Ceiling: 22, Left: 22, Right: 22, Corners: 8 = ~118 lines
      const totalGridLines = (gridDivisions + 1) * 2 * 5; // 5 surfaces, 2 directions each
      let lineIndex = 0;

      // Back wall grid
      for (let i = 0; i <= gridDivisions; i++) {
        const pos = -halfSize + i * step;
        // Vertical lines
        drawLine3D(pos, -halfSize, zFar, pos, halfSize, zFar, lineIndex++, totalGridLines);
        // Horizontal lines
        drawLine3D(-halfSize, pos, zFar, halfSize, pos, zFar, lineIndex++, totalGridLines);
      }

      // Floor grid
      for (let i = 0; i <= gridDivisions; i++) {
        const pos = -halfSize + i * step;
        const zPos = zNear + i * step;
        // Lines along X (left to right)
        drawLine3D(-halfSize, halfSize, zPos, halfSize, halfSize, zPos, lineIndex++, totalGridLines);
        // Lines along Z (front to back)
        drawLine3D(pos, halfSize, zNear, pos, halfSize, zFar, lineIndex++, totalGridLines);
      }

      // Ceiling grid
      for (let i = 0; i <= gridDivisions; i++) {
        const pos = -halfSize + i * step;
        const zPos = zNear + i * step;
        // Lines along X
        drawLine3D(-halfSize, -halfSize, zPos, halfSize, -halfSize, zPos, lineIndex++, totalGridLines);
        // Lines along Z
        drawLine3D(pos, -halfSize, zNear, pos, -halfSize, zFar, lineIndex++, totalGridLines);
      }

      // Left wall grid
      for (let i = 0; i <= gridDivisions; i++) {
        const pos = -halfSize + i * step;
        const zPos = zNear + i * step;
        // Vertical lines (along Y)
        drawLine3D(-halfSize, -halfSize, zPos, -halfSize, halfSize, zPos, lineIndex++, totalGridLines);
        // Horizontal lines (along Z)
        drawLine3D(-halfSize, pos, zNear, -halfSize, pos, zFar, lineIndex++, totalGridLines);
      }

      // Right wall grid
      for (let i = 0; i <= gridDivisions; i++) {
        const pos = -halfSize + i * step;
        const zPos = zNear + i * step;
        // Vertical lines
        drawLine3D(halfSize, -halfSize, zPos, halfSize, halfSize, zPos, lineIndex++, totalGridLines);
        // Horizontal lines
        drawLine3D(halfSize, pos, zNear, halfSize, pos, zFar, lineIndex++, totalGridLines);
      }

      // Corner edges - thick, same dynamic color
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 3;
      const cornerTotal = 8;
      let cornerIndex = 0;
      // Back corners
      drawLine3D(-halfSize, -halfSize, zFar, -halfSize, halfSize, zFar, cornerIndex++, cornerTotal);
      drawLine3D(halfSize, -halfSize, zFar, halfSize, halfSize, zFar, cornerIndex++, cornerTotal);
      drawLine3D(-halfSize, -halfSize, zFar, halfSize, -halfSize, zFar, cornerIndex++, cornerTotal);
      drawLine3D(-halfSize, halfSize, zFar, halfSize, halfSize, zFar, cornerIndex++, cornerTotal);
      // Side edges
      drawLine3D(-halfSize, -halfSize, zNear, -halfSize, -halfSize, zFar, cornerIndex++, cornerTotal);
      drawLine3D(halfSize, -halfSize, zNear, halfSize, -halfSize, zFar, cornerIndex++, cornerTotal);
      drawLine3D(-halfSize, halfSize, zNear, -halfSize, halfSize, zFar, cornerIndex++, cornerTotal);
      drawLine3D(halfSize, halfSize, zNear, halfSize, halfSize, zFar, cornerIndex++, cornerTotal);

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity }}
    />
  );
};
