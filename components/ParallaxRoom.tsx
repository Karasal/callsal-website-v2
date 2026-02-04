import React, { useEffect, useRef, useState } from 'react';

interface ParallaxRoomProps {
  opacity?: number;
}

export const ParallaxRoom: React.FC<ParallaxRoomProps> = ({ opacity = 1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // Max rotation in degrees (subtle effect)
      const maxRotation = 8;
      targetRotation.current = {
        x: -y * maxRotation, // Inverted: mouse up = look up
        y: x * maxRotation,
      };
    };

    // Smooth animation loop
    const animate = () => {
      setRotation(prev => ({
        x: prev.x + (targetRotation.current.x - prev.x) * 0.08,
        y: prev.y + (targetRotation.current.y - prev.y) * 0.08,
      }));
      animationFrame.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  // Grid pattern for walls
  const gridStyle = {
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
  };

  // Thicker grid for floor/ceiling
  const floorGridStyle = {
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
    `,
    backgroundSize: '80px 80px',
  };

  const roomDepth = 800; // How deep the room appears
  const roomSize = 2000; // Width/height of walls

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        opacity,
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Room container - this rotates based on mouse */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'none',
        }}
      >
        {/* Back wall */}
        <div
          className="absolute bg-white"
          style={{
            width: roomSize,
            height: roomSize,
            transform: `translateZ(-${roomDepth}px)`,
            ...gridStyle,
          }}
        />

        {/* Floor */}
        <div
          className="absolute bg-white"
          style={{
            width: roomSize,
            height: roomDepth * 2,
            transform: `rotateX(90deg) translateZ(${roomSize / 2}px)`,
            transformOrigin: 'center top',
            ...floorGridStyle,
          }}
        />

        {/* Ceiling */}
        <div
          className="absolute bg-white"
          style={{
            width: roomSize,
            height: roomDepth * 2,
            transform: `rotateX(-90deg) translateZ(${roomSize / 2}px)`,
            transformOrigin: 'center bottom',
            ...floorGridStyle,
          }}
        />

        {/* Left wall */}
        <div
          className="absolute bg-white"
          style={{
            width: roomDepth * 2,
            height: roomSize,
            transform: `rotateY(90deg) translateZ(${roomSize / 2}px)`,
            transformOrigin: 'right center',
            ...gridStyle,
          }}
        />

        {/* Right wall */}
        <div
          className="absolute bg-white"
          style={{
            width: roomDepth * 2,
            height: roomSize,
            transform: `rotateY(-90deg) translateZ(${roomSize / 2}px)`,
            transformOrigin: 'left center',
            ...gridStyle,
          }}
        />
      </div>
    </div>
  );
};
