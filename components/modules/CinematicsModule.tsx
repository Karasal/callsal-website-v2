import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, ChevronRight, X, Activity, BookOpen, Crown, Eye, Focus, Move, Film, Share2
} from 'lucide-react';
import { ModuleContentProps } from '../../types/modules';

type CinematicsModuleProps = ModuleContentProps;

interface SoftwareInfo {
  id: string;
  name: string;
  src: string;
  tagline: string;
  description: string;
  techStats: { label: string; value: string }[];
  url: string;
}

const softwareData: Record<string, SoftwareInfo> = {
  davinci: {
    id: 'davinci',
    name: "DaVinci Resolve Studio",
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio.png",
    tagline: "The Hollywood Standard for Color Grading.",
    description: "The world's most advanced solution for color correction, editing, and audio post-production. We use Resolve Studio to master every frame in 32-bit float color, ensuring your brand visuals meet the same technical standards as major theatrical releases.",
    techStats: [
      { label: "Precision", value: "32-bit Float" },
      { label: "Industry Use", value: "90% of Cinema" },
      { label: "Engine", value: "DaVinci Neural" }
    ],
    url: "https://www.blackmagicdesign.com/ca/products/davinciresolve"
  },
  dehancer: {
    id: 'dehancer',
    name: "Dehancer Film Emulation",
    src: "https://upload.wikimedia.org/wikipedia/commons/5/55/DehancerAppLogo.png?20240122135855",
    tagline: "Authentic Analog Texture & Chemistry.",
    description: "Dehancer allows us to bypass the sterile 'digital' look of modern cameras. It accurately simulates the chemical reaction of light on legendary film stocks, including optical halation, bloom, and organic grain profiles that add psychological weight to your story.",
    techStats: [
      { label: "Stocks", value: "60+ Emulations" },
      { label: "Effects", value: "Real Halation" },
      { label: "Texture", value: "Chemical Grain" }
    ],
    url: "https://www.dehancer.com/"
  },
  topaz: {
    id: 'topaz',
    name: "Topaz Video AI",
    src: "https://cdn.prod.website-files.com/6005fac27a49a9cd477afb63/68af97376fbc83545d307491_icon-topaz-video.svg",
    tagline: "Neural Reconstruction & Upscaling.",
    description: "Production-grade AI models trained specifically for video enhancement. We use Topaz to reconstruct detail in raw footage, perform ultra-smooth frame interpolation, and upscale content to 8K while maintaining surgical sharpness and zero digital artifacts.",
    techStats: [
      { label: "Upscale", value: "4K → 8K" },
      { label: "FPS", value: "120fps Interp" },
      { label: "AI Model", value: "Proteus v4" }
    ],
    url: "https://www.topazlabs.com/topaz-video"
  },
  higgsfield: {
    id: 'higgsfield',
    name: "Higgsfield AI",
    src: "/higgsfield-logo.svg",
    tagline: "AI-Powered Video Generation.",
    description: "Higgsfield represents the cutting edge of generative AI for video. We use it to create stunning visual content, animate concepts, and produce AI-generated footage that seamlessly integrates with our cinematic productions—expanding creative possibilities beyond traditional filming.",
    techStats: [
      { label: "Generation", value: "Text-to-Video" },
      { label: "Quality", value: "Cinema Grade" },
      { label: "Speed", value: "Real-time" }
    ],
    url: "https://www.higgsfield.ai/"
  }
};

const projects = [
  { id: "RLwo8clXyZM", title: "THE SUPREME BARBERSHOP YYC", company: "KALEB BRUNNING", tech: ["Dynamic Text", "Fast Cuts"], impact: "300% Engagement", description: "Fast-paced, high-energy brand showcase for Calgary's premier grooming destination, focusing on precision, style, and the art of the cut." },
  { id: "gxeU_tq7jH8", title: "SURVIVING THE SILENCE", company: "PETER HERBIG", tech: ["AI Voice", "Smart Editing"], impact: "Massive Viral Reach", description: "A gripping cinematic exploration of resilience and the human spirit, captured with raw emotional intensity and high-end visual storytelling." },
  { id: "2D6Dc7Pa_1s", title: "NATEFIT", company: "NATHANIEL ERNST", tech: ["Visual Data", "Auto-Clips"], impact: "Easier Client Onboarding", description: "A dynamic fitness journey documentary highlighting the transformational power of dedicated coaching and the strength of the YYC community." },
  { id: "1a7M7Np5g10", title: "SPRING CLEANUP COMMERCIAL", company: "K&M LANDSCAPING", tech: ["Dynamic Montage", "Local SEO Focus"], impact: "High Conversion Booking", description: "Transforming outdoor spaces into living art. A visual seasonal journey showcasing the mastery and evolution of premium Calgary landscapes." },
  { id: "RLUiuSgi0zU", title: "MAD BUILDERS", company: "MAD HOUSE", tech: ["Home Data Injection"], impact: "Cheaper Lead Costs", description: "Behind the scenes of architectural mastery, capturing the grit, precision, and glory involved in crafting high-end custom residential builds." },
  { id: "Up0lNvLU230", title: "I AM MATHEW", company: "MAD HOUSE", tech: ["Cinematic AI", "Sound Design"], impact: "Deep Emotional Impact", description: "An intimate and evocative cinematic portrait exploring personal identity through the specialized lens of modern digital creativity." },
];

// Software logo button with hover effect
const SoftwareItemButton = ({ software, onClick }: { software: SoftwareInfo; onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center group cursor-pointer h-16 lg:h-24 outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.img
        animate={{ opacity: isHovered ? 0.1 : 1, scale: isHovered ? 0.85 : 1 }}
        src={software.src}
        className="h-14 lg:h-20 w-auto object-contain transition-all duration-300"
        alt={software.name}
      />
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center text-xs font-display font-bold text-white text-center leading-none uppercase tracking-tighter"
          >
            {software.name}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

// Software detail modal
const SoftwareDetailModal = ({ software, onClose }: { software: SoftwareInfo; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[1100] flex items-center justify-center p-4 lg:p-12 bg-black/95 backdrop-blur-3xl"
    onClick={onClose}
  >
    <div className="max-w-4xl w-full glass-strong p-6 sm:p-8 lg:p-16 relative overflow-y-auto overflow-x-hidden max-h-[90vh] no-scrollbar border-t-4 border-[#CCFF00] rounded-2xl" onClick={e => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-50">
        <X size={32} />
      </button>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 space-y-6 sm:space-y-10 min-w-0">
          <div className="space-y-4">
            <span className="text-[9px] sm:text-[10px] font-body tracking-[0.3em] sm:tracking-[0.5em] text-[#CCFF00] uppercase font-bold">VIDEO EDITING SOFTWARE</span>
            <div className="flex items-center gap-4 sm:gap-6">
              <img src={software.src} className="h-10 sm:h-12 lg:h-16 w-auto object-contain shrink-0" alt="" />
              <h3 className="text-2xl sm:text-3xl lg:text-5xl font-display font-extrabold text-white uppercase tracking-tighter leading-none break-words">{software.name}</h3>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <p className="text-base sm:text-xl lg:text-2xl font-display font-bold text-white/90 uppercase leading-tight tracking-tight border-l-4 border-[#CCFF00] pl-4 sm:pl-6">
              {software.tagline}
            </p>
            <p className="text-xs sm:text-sm lg:text-base font-body font-medium text-gray-400 uppercase leading-relaxed tracking-wide">
              {software.description}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-white/20">
            {software.techStats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <span className="text-[8px] sm:text-[9px] font-body text-gray-400 uppercase block mb-1 font-bold tracking-widest">{stat.label}</span>
                <span className="text-xs sm:text-sm lg:text-base font-display font-bold text-white uppercase">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-[280px] flex flex-col justify-end gap-4 sm:gap-6 shrink-0">
          <div className="p-4 sm:p-6 lg:p-8 glass flex flex-col items-center text-center">
            <Activity className="text-[#CCFF00] mb-3 sm:mb-4" size={32} />
            <p className="text-[9px] sm:text-[10px] font-body font-bold text-gray-400 uppercase tracking-wider sm:tracking-widest leading-relaxed">
              SYSTEM INTEGRATED INTO MASTER PRODUCTION PIPELINE
            </p>
          </div>
          <a
            href={software.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 sm:py-6 btn-primary text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.4em] text-center block"
          >
            VIEW FULL SPECS
          </a>
        </div>
      </div>
    </div>
  </motion.div>
);

// Video player modal
const VideoModal = ({ id, title, onClose }: { id: string; title: string; onClose: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (isMobileDevice && containerRef.current) {
      const enterFullscreen = async () => {
        try {
          await containerRef.current?.requestFullscreen();
          if (screen.orientation && 'lock' in screen.orientation) {
            await (screen.orientation as any).lock('landscape').catch(() => {});
          }
        } catch (e) {}
      };
      enterFullscreen();
    }
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      if (screen.orientation && 'unlock' in screen.orientation) {
        (screen.orientation as any).unlock();
      }
    };
  }, [isMobileDevice]);

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    onClose();
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 lg:p-12 bg-black/95 backdrop-blur-3xl"
    >
      <div className="max-w-6xl w-full relative">
        <button onClick={handleClose} className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors z-10">
          <X size={32} />
        </button>
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/20">
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&playsinline=0`}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
        <div className="mt-6 hidden lg:block">
          <h3 className="text-xl lg:text-2xl font-display font-bold text-white uppercase tracking-tight">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
};

// Image lightbox modal
const ImageLightbox = ({ src, onClose }: { src: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl cursor-pointer"
    onClick={onClose}
  >
    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10">
      <X size={32} />
    </button>
    <img src={src} className="max-w-full max-h-[90vh] object-contain rounded-xl" alt="" />
  </motion.div>
);

export const CinematicsModule: React.FC<CinematicsModuleProps> = ({
  onClose,
  onConsultation,
}) => {
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareInfo | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Full interactive mode
  return (
    <div className="px-6 pt-6 pb-2 lg:px-8 lg:pt-8 lg:pb-2">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 sm:w-12 h-[1px] bg-[#CCFF00]" />
          <span className="text-[9px] sm:text-[10px] font-body tracking-[0.4em] text-[#CCFF00] uppercase font-bold">HIGH-END DOCUMENTARY</span>
          <div className="w-8 sm:w-12 h-[1px] bg-[#CCFF00]" />
        </div>
        <h2 className="text-3xl lg:text-[5rem] font-display font-black text-white uppercase tracking-tighter leading-none mb-4">CINEMATICS.</h2>
        <div className="flex flex-col items-center gap-0">
          <p className="text-base lg:text-2xl font-display font-bold text-white uppercase tracking-wide">
            AI POWERS THE SCALE.
          </p>
          <p className="text-base lg:text-2xl font-display font-bold uppercase tracking-wide gradient-text">
            CINEMA CAPTURES THE SOUL.
          </p>
        </div>
      </div>

      {/* Intro description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <div className="space-y-6">
          <p className="text-base lg:text-xl font-display font-medium text-white/90 uppercase leading-snug tracking-tight">
            As exciting as it is to be AI-powered, what really makes it all work is remembering that you are still serving a <span className="gradient-text">human audience</span>.
          </p>
          <p className="text-xs sm:text-sm font-body font-bold text-gray-400 uppercase leading-relaxed">
            The most powerful evergreen marketing tool is a high-end cinematic mini-documentary. We humanize your brand through artistic interview footage and Hollywood-grade B-roll.
          </p>
        </div>
        <div className="space-y-5 lg:border-l lg:border-white/20 lg:pl-10">
          <div className="flex items-start gap-3">
            <BookOpen className="text-[#CCFF00] shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-xs font-display font-bold text-white uppercase mb-1">HERITAGE BRANDING</p>
              <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase leading-relaxed font-bold">This isn't just an advertisement. It's a legacy piece that grows in value as your company matures, building subconscious trust with every viewer.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Crown className="text-[#CCFF00] shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-xs font-display font-bold text-white uppercase mb-1">UNMATCHED AUTHORITY</p>
              <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase leading-relaxed font-bold">The visual texture of Hollywood cinema bypasses the natural skepticism of modern leads. They stop seeing a "service provider" and start seeing a "market leader."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Netflix + Omni-Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <div className="flex items-start gap-3">
          <Film className="text-[#CCFF00] shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs font-display font-bold text-white uppercase mb-1">GET CONTENT THAT LOOKS LIKE NETFLIX.</p>
            <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase leading-relaxed font-bold">We add a massive professional edge to your online presence. People take this level of quality seriously — and they take the businesses who use it seriously.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Share2 className="text-[#CCFF00] shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs font-display font-bold text-white uppercase mb-1">OMNI-CHANNEL LEVERAGE.</p>
            <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase leading-relaxed font-bold">While our films engage on an emotional level, our AI neural networks take that one master film and distribute it across thousands of channels instantly.</p>
          </div>
        </div>
      </div>

      {/* Hollywood Advantage */}
      <div className="glass-strong overflow-hidden rounded-2xl mb-12">
        <div className="glass-strong p-6 sm:p-10 lg:p-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[9px] sm:text-[10px] font-body tracking-[0.3em] sm:tracking-[0.5em] text-white/70 uppercase font-bold block mb-4 sm:mb-6 px-2 sm:px-3 py-1 bg-white/10 inline-block rounded">NARRATIVE-DRIVEN BRAND STORIES</span>
            <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white uppercase tracking-tighter leading-[0.85] mb-4 sm:mb-6">THE HOLLYWOOD <br /> ADVANTAGE.</h4>
            <p className="text-sm sm:text-base lg:text-xl font-display font-bold text-white/80 uppercase tracking-tight max-w-xl leading-snug">
              WE USE THE SAME TOOLS AS <span className="text-red-600">NETFLIX MASTERPIECES</span>. WHY? BECAUSE YOUR BUSINESS DESERVES TO LOOK LIKE A GLOBAL LEADER, NOT A STARTUP.
            </p>
          </div>
          <div className="relative z-10 flex flex-col items-start sm:items-end w-full sm:w-auto">
            <div className="px-4 sm:px-6 py-4 sm:py-6 bg-black text-white font-body font-bold text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-xl flex flex-col items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <span className="opacity-60 text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em]">PRODUCTION SOFTWARE</span>
              <div className="flex items-center gap-2">
                <SoftwareItemButton software={softwareData.davinci} onClick={() => setSelectedSoftware(softwareData.davinci)} />
                <SoftwareItemButton software={softwareData.dehancer} onClick={() => setSelectedSoftware(softwareData.dehancer)} />
                <SoftwareItemButton software={softwareData.higgsfield} onClick={() => setSelectedSoftware(softwareData.higgsfield)} />
                <SoftwareItemButton software={softwareData.topaz} onClick={() => setSelectedSoftware(softwareData.topaz)} />
              </div>
              <span className="text-[8px] sm:text-[9px] font-body text-gray-400 uppercase tracking-widest">CLICK FOR INTEL</span>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8 lg:p-16 space-y-10 sm:space-y-16">
          {/* RED Camera section */}
          <div className="space-y-8 sm:space-y-12 border-b border-gray-100 pb-10 sm:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
              <div className="lg:col-span-7">
                <div className="aspect-video relative overflow-hidden rounded-xl border border-white/20 bg-black cursor-pointer group" onClick={() => setSelectedImage("https://images.red.com/komodo-x/kx-rf-main-features-2x.jpg")}>
                  <img src="https://images.red.com/komodo-x/kx-rf-main-features-2x.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt="RED Komodo-X" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8">
                    <span className="text-[9px] sm:text-[10px] font-body font-bold text-[#CCFF00] uppercase block mb-1 sm:mb-2">MADE IN CALIFORNIA</span>
                    <p className="text-base sm:text-xl lg:text-2xl font-display font-extrabold text-white uppercase tracking-tighter">RED KOMODO-X 6K CINEMA CAMERA</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6">
                <span className="text-[10px] sm:text-[11px] font-body font-bold text-[#CCFF00] uppercase tracking-[0.3em] sm:tracking-[0.4em]">THE PSYCHOLOGY OF TRUST</span>
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-[0.9]">THE COVER TELLS THE STORY.</h4>
                <p className="text-xs sm:text-sm font-body font-bold text-gray-400 uppercase leading-relaxed">
                  In a digital-first world, your content is your reputation. An iPhone video signals a "startup"—this level of production signals a "market leader."
                </p>
                <p className="text-xs sm:text-sm font-body font-bold text-gray-400 uppercase leading-relaxed">
                  High-end visuals bypass the customer's logic and hit them straight in the gut, building instant faith in what you deliver.
                </p>
              </div>
            </div>
            {/* Feature cards + Netflix badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="glass p-6 sm:p-8 rounded-xl">
                <div className="w-8 h-8 mb-4 flex items-center justify-center text-[#CCFF00]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line></svg>
                </div>
                <h5 className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-tight mb-3">6K NARRATIVE MASTERING</h5>
                <p className="text-[10px] sm:text-xs font-body font-bold text-gray-400 uppercase leading-relaxed">
                  This is about visual weight. We capture the "texture" of film that makes your business look expensive and authoritative.
                </p>
              </div>
              <div className="glass p-6 sm:p-8 rounded-xl">
                <div className="w-8 h-8 mb-4 flex items-center justify-center text-[#CCFF00]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21l5-5"></path><path d="M7 21l-5-5"></path><path d="M12 21V11"></path><path d="M4 11h16"></path><path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path><path d="M9 7V5"></path><path d="M15 7V5"></path></svg>
                </div>
                <h5 className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-tight mb-3">HOLLYWOOD COLOR GRADE</h5>
                <p className="text-[10px] sm:text-xs font-body font-bold text-gray-400 uppercase leading-relaxed">
                  We use the same color science as Netflix hits, allowing us to master your documentary so it looks like it belongs on the big screen.
                </p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1 p-6 sm:p-8 rounded-xl bg-[#8B0000]/80 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] sm:text-[10px] font-body font-bold text-gray-400 uppercase tracking-[0.3em] mb-3">OFFICIALLY APPROVED FOR</span>
                <span className="text-3xl sm:text-4xl font-display font-black text-[#E50914] uppercase tracking-tight">NETFLIX</span>
              </div>
            </div>
          </div>

          {/* Sirui Saturn Anamorphic */}
          <div className="space-y-8 sm:space-y-12 border-b border-gray-100 pb-10 sm:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6 order-2 lg:order-1">
                <span className="text-[10px] sm:text-[11px] font-body font-bold text-[#CCFF00] uppercase tracking-[0.3em] sm:tracking-[0.4em]">CINEMATIC FLARES & BOKEH</span>
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-[0.9]">SIRUI SATURN <br />ANAMORPHIC.</h4>
                <p className="text-xs sm:text-sm font-body font-bold text-gray-400 uppercase leading-relaxed">
                  We use specialized anamorphic glass to get that iconic widescreen look from the movies. Beautiful oval bokeh and cinematic blue flares create a visual atmosphere that regular lenses simply cannot replicate.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-lg">
                    <span className="text-[9px] font-body text-[#CCFF00] uppercase block mb-1">VISUALS</span>
                    <span className="text-[10px] font-display font-bold text-white uppercase">WIDESCREEN EPIC</span>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <span className="text-[9px] font-body text-[#CCFF00] uppercase block mb-1">FEEL</span>
                    <span className="text-[10px] font-display font-bold text-white uppercase">CINEMA TEXTURE</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="aspect-video relative overflow-hidden rounded-xl border border-white/20 bg-black cursor-pointer group mb-6" onClick={() => setSelectedImage("https://cdn.shopifycdn.net/s/files/1/0449/9344/6037/files/v1-1.jpg?v=1677661259")}>
                  <img src="https://cdn.shopifycdn.net/s/files/1/0449/9344/6037/files/v1-1.jpg?v=1677661259" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt="Sirui Saturn Lens Flare" />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent" />
                </div>
                <div className="glass p-6 sm:p-8 rounded-xl border-l-4 border-[#CCFF00]">
                  <p className="text-xs font-display font-bold text-white uppercase tracking-wide mb-2 italic">"SIRUI SATURN SERIES IS THE TAILORED SUIT FOR YOUR BRAND."</p>
                  <p className="text-[10px] font-body text-gray-400 uppercase">It signals that your business isn't just operating—it's performing at a movie-star level.</p>
                </div>
              </div>
            </div>
          </div>

          {/* DJI RS3 Pro & LiDAR */}
          <div className="space-y-8 sm:space-y-12 border-b border-gray-100 pb-10 sm:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
              <div className="lg:col-span-7">
                <div className="aspect-video relative overflow-hidden rounded-xl border border-white/20 bg-black cursor-pointer group mb-6" onClick={() => setSelectedImage("https://www.diyphotography.net/wp-content/uploads/2024/04/dji-rs4-rs4pro-focuspro-928x522.jpg")}>
                  <img src="https://www.diyphotography.net/wp-content/uploads/2024/04/dji-rs4-rs4pro-focuspro-928x522.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt="DJI RS3 Pro + LiDAR Focus" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                    <span className="text-[8px] sm:text-[9px] font-body font-bold text-white uppercase tracking-widest">LIDAR_LASER_FOCUS_ACTIVE</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 glass p-4 sm:p-6 rounded-xl flex items-center gap-4">
                    <Move className="text-[#CCFF00] shrink-0" size={20} />
                    <span className="text-[10px] font-display font-bold text-white uppercase">STEADY MOTION CONTROL</span>
                  </div>
                  <div className="flex-1 glass p-4 sm:p-6 rounded-xl flex items-center gap-4">
                    <Focus className="text-[#CCFF00] shrink-0" size={20} />
                    <span className="text-[10px] font-display font-bold text-white uppercase">LASER FOCUS TRACKING</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6">
                <span className="text-[10px] sm:text-[11px] font-body font-bold text-[#CCFF00] uppercase tracking-[0.3em] sm:tracking-[0.4em]">PRECISION CAMERA CONTROL</span>
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-[0.9]">SMOOTH. SHARP. <br />SUPERIOR.</h4>
                <p className="text-xs sm:text-sm font-body font-bold text-gray-400 uppercase leading-relaxed">
                  Shaky footage looks like a home video. We use the DJI RS3 Pro with laser LiDAR focusing to ensure every frame is rock-steady and pin-sharp. Whether it's a slow cinematic glide or high-action tracking, the motion is perfectly controlled.
                </p>
                <p className="text-[11px] font-body font-bold text-gray-400 uppercase leading-relaxed border-t border-white/20 pt-4 sm:pt-6">
                  Our LiDAR system maps the environment in 3D using lasers, keeping you in perfect focus regardless of lighting conditions—we never miss "The Moment."
                </p>
              </div>
            </div>
          </div>

          {/* Video Player Grid */}
          <div className="space-y-8 sm:space-y-12 border-b border-gray-100 pb-10 sm:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
              {/* Video Thumbnail */}
              <div className="lg:col-span-7">
                <div
                  className="aspect-video relative overflow-hidden rounded-xl border border-white/20 bg-black cursor-pointer group"
                  onClick={() => setIsVideoOpen(true)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${activeProject.id}/maxresdefault.jpg`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                    alt={activeProject.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#CCFF00] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="text-black ml-1" size={28} />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                    <span className="text-[9px] sm:text-[10px] font-body font-bold text-[#CCFF00] uppercase block mb-1">{activeProject.company}</span>
                    <p className="text-sm sm:text-lg font-display font-extrabold text-white uppercase tracking-tighter">{activeProject.title}</p>
                  </div>
                </div>
              </div>

              {/* Case Study Card */}
              <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
                <div className="glass p-6 sm:p-8 rounded-xl flex-1">
                  <span className="text-[9px] sm:text-[10px] font-body font-bold text-[#CCFF00] uppercase tracking-[0.3em] block mb-3">CASE STUDY</span>
                  <h4 className="text-lg sm:text-xl font-display font-extrabold text-white uppercase tracking-tighter leading-tight mb-3">{activeProject.title}</h4>
                  <p className="text-[10px] sm:text-xs font-body font-bold text-gray-400 uppercase leading-relaxed mb-4">{activeProject.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeProject.tech.map((t, i) => (
                      <span key={i} className="text-[8px] sm:text-[9px] font-body font-bold text-white/70 uppercase tracking-wider px-2 py-1 bg-white/10 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="text-[#CCFF00] shrink-0" size={14} />
                    <span className="text-[10px] font-display font-bold text-white uppercase">{activeProject.impact}</span>
                  </div>
                </div>

                <button
                  onClick={() => { onClose(); onConsultation?.(); }}
                  className="btn-primary w-full py-4 text-[9px] sm:text-[10px] tracking-[0.3em]"
                >
                  BOOK A CHAT
                </button>
              </div>
            </div>

            {/* Project selector — underneath video player */}
            <div className="flex flex-wrap gap-2 mt-4">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all text-left ${
                    activeProject.id === project.id
                      ? 'bg-white/10 border border-white/20'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <ChevronRight className={`shrink-0 transition-colors ${activeProject.id === project.id ? 'text-[#CCFF00]' : 'text-gray-600'}`} size={14} />
                  <div className="min-w-0">
                    <p className={`text-[10px] sm:text-[11px] font-display font-bold uppercase tracking-tight truncate ${activeProject.id === project.id ? 'text-white' : 'text-gray-400'}`}>{project.title}</p>
                    <p className="text-[8px] sm:text-[9px] font-body text-gray-500 uppercase truncate">{project.company}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
            <div className="max-w-3xl">
              <h4 className="text-2xl sm:text-3xl lg:text-5xl font-display font-extrabold text-white uppercase tracking-tighter leading-none mb-4 sm:mb-6">
                NETFLIX QUALITY. <span className="text-gray-400">MINUS THE EGO.</span>
              </h4>
              <p className="text-[11px] sm:text-xs lg:text-sm font-display font-bold text-gray-400 uppercase leading-relaxed mb-6 sm:mb-10">
                Traditional Hollywood agencies charge $50k+ for this setup. By leveraging AI and keeping our team lean, I deliver Cinematic Masterworks for a fraction of the cost.
              </p>
              <button onClick={() => { onClose(); onConsultation?.(); }} className="btn-primary px-8 sm:px-12 py-4 sm:py-6 text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em]">
                SECURE YOUR CINEMATIC AUDIT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Internal modals — portal to body to escape transform: scale() in Module3DOverlay */}
      {createPortal(
        <>
          <AnimatePresence>
            {isVideoOpen && <VideoModal id={activeProject.id} title={activeProject.title} onClose={() => setIsVideoOpen(false)} />}
          </AnimatePresence>
          <AnimatePresence>
            {selectedSoftware && <SoftwareDetailModal software={selectedSoftware} onClose={() => setSelectedSoftware(null)} />}
          </AnimatePresence>
          <AnimatePresence>
            {selectedImage && <ImageLightbox src={selectedImage} onClose={() => setSelectedImage(null)} />}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
};

export default CinematicsModule;
