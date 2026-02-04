import React, { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TVOverlayProps {
  isActive: boolean;
  onClose: () => void;
  scrollProgress: number;
  smoothMouse: { x: number; y: number };
}

// Video projects data
const projects = [
  { id: "RLwo8clXyZM", title: "THE SUPREME BARBERSHOP YYC", company: "KALEB BRUNNING", impact: "300% Engagement", description: "Fast-paced, high-energy brand showcase for Calgary's premier grooming destination." },
  { id: "gxeU_tq7jH8", title: "SURVIVING THE SILENCE", company: "PETER HERBIG", impact: "Massive Viral Reach", description: "A gripping cinematic exploration of resilience and the human spirit." },
  { id: "2D6Dc7Pa_1s", title: "NATEFIT", company: "NATHANIEL ERNST", impact: "Easier Client Onboarding", description: "A dynamic fitness journey documentary highlighting transformational coaching." },
  { id: "1a7M7Np5g10", title: "SPRING CLEANUP", company: "K&M LANDSCAPING", impact: "High Conversion", description: "Transforming outdoor spaces into living art." },
  { id: "RLUiuSgi0zU", title: "MAD BUILDERS", company: "MAD HOUSE", impact: "Cheaper Leads", description: "Behind the scenes of architectural mastery." },
  { id: "Up0lNvLU230", title: "I AM MATHEW", company: "MAD HOUSE", impact: "Deep Impact", description: "An intimate cinematic portrait exploring personal identity." },
];

export const TVOverlay: React.FC<TVOverlayProps> = ({
  isActive,
  onClose,
  scrollProgress,
  smoothMouse,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPanels, setShowPanels] = useState(false);
  const [activeProject, setActiveProject] = useState(projects[0]);

  // Animation sequence
  useEffect(() => {
    if (isActive) {
      const t1 = setTimeout(() => setIsFlipped(true), 100);
      const t2 = setTimeout(() => setShowPanels(true), 500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      setIsFlipped(false);
      setShowPanels(false);
    }
  }, [isActive]);

  if (!isActive) return null;

  // Subtle parallax offset based on mouse (just translation, no resize)
  const parallaxX = (smoothMouse.x - 0.5) * 30;
  const parallaxY = (smoothMouse.y - 0.5) * 20;

  // Fixed layout dimensions (responsive to viewport)
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 1080;

  // TV: 38% width, 16:9 aspect, centered-left
  const tvWidth = screenW * 0.38;
  const tvHeight = tvWidth * (9 / 16);
  const tvLeft = screenW * 0.18;
  const tvTop = screenH * 0.2;

  // Selector: narrower, right of TV
  const selectorWidth = screenW * 0.18;
  const selectorHeight = tvHeight;
  const selectorLeft = tvLeft + tvWidth + 16;
  const selectorTop = tvTop;

  // Info bar: spans TV + selector, below both
  const infoWidth = tvWidth + selectorWidth + 16;
  const infoHeight = 44;
  const infoLeft = tvLeft;
  const infoTop = tvTop + tvHeight + 12;

  return (
    <>
      {/* TV Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="fixed z-[100] pointer-events-auto"
        style={{
          left: tvLeft + parallaxX,
          top: tvTop + parallaxY,
          width: tvWidth,
          height: tvHeight,
          perspective: '1000px',
        }}
      >
        {/* Flip container */}
        <div
          className="relative w-full h-full transition-transform duration-500 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front - Diorama */}
          <div
            className="absolute inset-0 overflow-hidden rounded-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <img
              src="/calgary-diorama.jpg"
              alt="Calgary Diorama"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Back - Video */}
          <div
            className="absolute inset-0 bg-black overflow-hidden rounded-xl border border-white/20"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {isFlipped && (
              <iframe
                key={activeProject.id}
                src={`https://www.youtube.com/embed/${activeProject.id}?autoplay=1&mute=0&controls=1&rel=0`}
                title={activeProject.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 p-2 bg-black/90 hover:bg-[#CCFF00] hover:text-black rounded-full transition-colors z-10 border border-white/20"
        >
          <X size={18} className="text-current" />
        </button>
      </motion.div>

      {/* Selector Panel */}
      <AnimatePresence>
        {showPanels && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed z-[100] pointer-events-auto"
            style={{
              left: selectorLeft + parallaxX * 1.1,
              top: selectorTop + parallaxY * 1.1,
              width: selectorWidth,
              height: selectorHeight,
            }}
          >
            <div className="w-full h-full glass rounded-xl p-3 overflow-y-auto no-scrollbar">
              <div className="space-y-2">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProject(p)}
                    className={`w-full p-3 text-left rounded-lg border transition-all flex items-center gap-2 ${
                      activeProject.id === p.id
                        ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                        : 'bg-black/50 text-white border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`text-[9px] font-body font-bold uppercase truncate ${
                        activeProject.id === p.id ? 'text-black/50' : 'text-gray-500'
                      }`}>
                        {p.company}
                      </p>
                      <p className="font-display font-bold uppercase text-xs truncate leading-tight">
                        {p.title}
                      </p>
                    </div>
                    <ChevronRight size={14} className="shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Bar */}
      <AnimatePresence>
        {showPanels && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="fixed z-[100] pointer-events-auto"
            style={{
              left: infoLeft + parallaxX * 0.9,
              top: infoTop + parallaxY * 0.9,
              width: infoWidth,
              height: infoHeight,
            }}
          >
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full glass rounded-xl px-5 flex items-center gap-4"
            >
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse" />
                <span className="text-[10px] font-body tracking-[0.15em] text-[#CCFF00] uppercase font-bold">
                  NOW PLAYING
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-display font-extrabold text-white uppercase tracking-tighter leading-tight truncate">
                  {activeProject.title}
                </h4>
              </div>
              <span className="px-3 py-1 bg-black/50 text-[9px] font-body text-[#CCFF00] uppercase tracking-wider font-bold rounded shrink-0">
                {activeProject.company}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TVOverlay;
