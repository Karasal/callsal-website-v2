import React, { useState, useRef, useEffect } from 'react';
import { useMobileAnimations } from '../hooks/useMobileAnimations';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, X, Activity, Target, Terminal, Cpu, Layers, Database, Shield, Bot, GitBranch, TrendingUp, MonitorPlay, Heart, Radio, Camera, Award, Star, Info, Zap, Settings, HardDrive, Share2, Eye, Focus, Move, Film, UserCheck, Clapperboard, Monitor, Sparkles, Smile as SmileIcon, Box, Compass, MousePointer2, MessageSquare, Hammer, Laptop, Video, Smartphone, CheckCircle, Code, Server, Link, ShieldCheck, Search, Globe, Brain, ShieldAlert, FileCheck, ClipboardList, Briefcase, BookOpen, Crown } from 'lucide-react';
import { ImageModal } from './ImageModal';

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
      { label: "Upscaling", value: "Up to 16K" },
      { label: "AI Models", value: "Iris / Proteus" },
      { label: "Function", value: "Motion Deblur" }
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

const ProximityHeroText = () => {
  const baseClasses = "text-[15vw] sm:text-[12vw] md:text-[11vw] lg:text-[9vw] xl:text-[8vw] 2xl:text-[7.5vw] font-display font-extrabold leading-[0.85] tracking-tighter uppercase flex flex-col items-start";
  const limeStyle = { color: '#CCFF00', WebkitTextFillColor: '#CCFF00' } as React.CSSProperties;
  const whiteStyle = {
    color: '#ffffff',
    WebkitTextFillColor: '#ffffff',
    WebkitTextStroke: '3px #000',
    paintOrder: 'stroke fill',
  } as React.CSSProperties;

  return (
    <div className="mb-6 lg:mb-8">
      <h1 className={baseClasses}>
        <span className="block whitespace-nowrap">
          <span style={whiteStyle}>"</span>
          <span style={limeStyle}>HI</span>
          <span style={whiteStyle}> - IT'S</span>
        </span>
        <span className="block whitespace-nowrap" style={whiteStyle}>YOUR NEW</span>
        <span className="block whitespace-nowrap pb-2 sm:pb-4 lg:pb-4">
          <span style={whiteStyle}>PAL, </span>
          <span style={limeStyle}>SAL</span>
          <span style={whiteStyle}>!"</span>
        </span>
      </h1>
    </div>
  );
};


const SoftwareItem = ({ software, onClick }: { software: SoftwareInfo, onClick: () => void }) => {
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center text-xs font-display font-bold text-white text-center leading-none uppercase tracking-tighter"
          >
            {software.name}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

const SoftwareDetailModal = ({ software, onClose }: { software: SoftwareInfo, onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 lg:p-12 bg-black/95 backdrop-blur-3xl"
    >
      <div className="max-w-4xl w-full glass-strong p-6 sm:p-8 lg:p-16 relative overflow-y-auto overflow-x-hidden max-h-[90vh] no-scrollbar border-t-4 border-[#CCFF00] rounded-2xl">
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
};

const VideoModal = ({ id, title, onClose }: { id: string, title: string, onClose: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (isMobileDevice && containerRef.current) {
      // Try to go fullscreen and lock to landscape on mobile
      const enterFullscreen = async () => {
        try {
          await containerRef.current?.requestFullscreen();
          // Try to lock orientation to landscape
          if (screen.orientation && 'lock' in screen.orientation) {
            await (screen.orientation as any).lock('landscape').catch(() => {});
          }
        } catch (e) {
          // Fullscreen not supported or denied
        }
      };
      enterFullscreen();
    }

    return () => {
      // Exit fullscreen and unlock orientation on close
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
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 lg:p-12 bg-black/95 backdrop-blur-3xl"
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

// TheArmory and VideoPortfolio are defined below as part of this file
// to keep the same structure as v1

const TheArmory = ({ onShowSoftware, onShowImage, onConsultation }: { onShowSoftware: (s: SoftwareInfo) => void, onShowImage: (src: string) => void, onConsultation: () => void }) => {
  const [activeCategory, setActiveCategory] = useState<'software' | 'hardware'>('software');
  const [activeItem, setActiveItem] = useState(0);
  const { isMobile } = useMobileAnimations();
  const armoryRef = useRef<HTMLHeadingElement>(null);
  
  const armoryData = {
    software: [
      {
        id: 'agentic-logic',
        title: 'AI HELPER BOTS',
        blurb: 'Autonomous Thinking Machines.',
        icon: <Brain size={20} />,
        content: (
          <div className="space-y-6">
            <h4 className="text-2xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">DUPLICATE YOURSELF</h4>
            <div className="p-6 bg-[#CCFF00] text-black rounded-xl mb-6">
              <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight">
                PLAIN ENGLISH: I build "digital brains" that can read your emails, understand your business rules, and make decisions just like a trained employee would.
              </p>
            </div>
            <p className="text-sm lg:text-base font-body font-medium text-gray-400 uppercase leading-relaxed tracking-wide">
              We leverage <span className="text-[#4285F4]">Gemini 3 Pro</span> and <span className="text-[#E07A5F]">Claude Opus 4.5</span> to build agents that don't just chat—they orchestrate. These engines process complex context, use external tools, and follow multi-step instructions autonomously.
            </p>
            <div className="space-y-6 pt-4 border-t border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-[9px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">REAL ESTATE</span>
                  <p className="text-[10px] text-gray-400 uppercase leading-tight font-bold">Instantly qualifies leads from platforms like Zillow, checks your calendar, and books tours based on property location and traffic patterns.</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">E-COMMERCE</span>
                  <p className="text-[10px] text-gray-400 uppercase leading-tight font-bold">Handles 'Where is my order?' queries by actually checking shipping APIs and issuing partial refunds for delays—without you lifting a finger.</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">PROFESSIONAL SERVICES</span>
                  <p className="text-[10px] text-gray-400 uppercase leading-tight font-bold">Scans legal documents for risk clauses or summarizes 50+ page discovery files into 5 high-impact bullet points for your morning review.</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">LOCAL TRADES</span>
                  <p className="text-[10px] text-gray-400 uppercase leading-tight font-bold">Reviews photos of a job site sent via SMS, calculates a rough material cost based on market rates, and sends a preliminary quote 24/7.</p>
                </div>
              </div>
              <div className="p-4 glass rounded-xl">
                <p className="text-[10px] font-display font-bold text-white uppercase tracking-widest mb-2">BENEFIT: UNLIMITED BRAINPOWER</p>
                <p className="text-[9px] font-body text-gray-400 uppercase leading-tight">These agents never sleep, never get bored, and their capacity is limited only by your imagination. They are the ultimate force-multiplier for a lean, high-profit team.</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'automation-glue',
        title: 'WORKFLOW AUTOMATION',
        blurb: 'The Invisible Glue of Success.',
        icon: <Link size={20} />,
        content: (
          <div className="space-y-6">
            <h4 className="text-2xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">SYMPHONY BRIDGES</h4>
            <div className="p-6 glass rounded-xl mb-6">
              <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight text-white">
                PLAIN ENGLISH: I connect your CRM, your Inbox, and your Invoices so they talk to each other. When something happens in one place, everything else updates automatically. No more copy-pasting.
              </p>
            </div>
            <div className="space-y-8">
              <p className="text-sm lg:text-lg font-display font-medium text-white/70 uppercase leading-relaxed tracking-wide border-l-4 border-[#CCFF00] pl-6">
                Think of your business like a train track. Right now, you're the one manually switching the tracks for every single train (task). I build the automatic switches. When a new customer emails you, the system automatically writes down their info, tells your team, and sets a reminder to call them back. You don't have to lift a finger—the train just stays on the track.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="p-6 glass rounded-xl group transition-all hover:border-[#00F0FF]/30">
                  <h5 className="text-[#CCFF00] font-body text-[10px] font-bold uppercase tracking-widest mb-4">THE REAL ESTATE AGENT</h5>
                  <p className="text-sm font-display font-bold text-white/90 uppercase leading-tight mb-4">"THE INSTANT HANDOFF"</p>
                  <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                    A lead comes in from Zillow. Instead of you finding it 4 hours later in your noisy inbox, the system sees it, adds it to your contact list, and texts you their phone number and "must-have" list instantly. You're calling them while they're still on the property page.
                  </p>
                </div>
                <div className="p-6 glass rounded-xl group transition-all hover:border-[#00F0FF]/30">
                  <h5 className="text-[#CCFF00] font-body text-[10px] font-bold uppercase tracking-widest mb-4">THE ONLINE SHOP</h5>
                  <p className="text-sm font-display font-bold text-white/90 uppercase leading-tight mb-4">"THE LOYALTY ENGINE"</p>
                  <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                    A sale happens. The system tells your shipping app to print a label, tells your accounting app to record the tax, and sends the customer a customized 'Welcome' video from you. It then waits 7 days and asks them for a review. You never touched a button.
                  </p>
                </div>
                <div className="p-6 glass rounded-xl group transition-all hover:border-[#00F0FF]/30">
                  <h5 className="text-[#CCFF00] font-body text-[10px] font-bold uppercase tracking-widest mb-4">THE LOCAL TRADESMAN</h5>
                  <p className="text-sm font-display font-bold text-white/90 uppercase leading-tight mb-4">"THE PROJECT PROMOTER"</p>
                  <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                    You finish a job and snap a photo. The system puts that photo on your website as a 'Recent Work' post, updates your Instagram, and sends the customer a link to leave a 5-star review. Your marketing is done before you've even left the driveway.
                  </p>
                </div>
                <div className="p-6 glass rounded-xl group transition-all hover:border-[#00F0FF]/30">
                  <h5 className="text-[#CCFF00] font-body text-[10px] font-bold uppercase tracking-widest mb-4">PROFESSIONAL SERVICES</h5>
                  <p className="text-sm font-display font-bold text-white/90 uppercase leading-tight mb-4">"THE CLIENT ONBOARDER"</p>
                  <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                    An invoice is paid. The system automatically creates a new folder in Google Drive for the client, drafts the contract, and notifies your operations manager to start the intake. All the paperwork is ready before you even finish your coffee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'customer-ops',
        title: 'CUSTOM CRM DEVELOPMENT',
        blurb: 'Bespoke Business Command Centers.',
        icon: <ShieldCheck size={20} />,
        content: (
          <div className="space-y-10">
            <div>
              <h4 className="text-2xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-none mb-6">THE OPERATIONS VAULT</h4>
              <div className="p-6 glass rounded-xl mb-8">
                <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight text-white">
                  PLAIN ENGLISH: I build a private "portal" for your business. Your clients can log in, see their progress, and pay you—all in one clean, professional place that builds massive trust.
                </p>
              </div>
              <p className="text-sm lg:text-lg font-display font-medium text-white/70 uppercase leading-relaxed tracking-wide border-l-4 border-[#CCFF00] pl-6 mb-10">
                A custom hub removes the chaos of email chains and lost attachments. It provides a single, secured "Source of Truth" for your clients, making you look like a tech-forward industry leader while reducing administrative friction.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <div className="p-8 glass rounded-xl group transition-all hover:border-[#00F0FF]/30">
                  <div className="flex items-center gap-4 mb-6">
                    <Hammer className="text-[#CCFF00]" size={24} />
                    <h5 className="text-lg font-display font-bold text-white uppercase tracking-tight">THE MODERN CONTRACTOR</h5>
                  </div>
                  <p className="text-[10px] font-body text-[#CCFF00] uppercase mb-4 font-bold">UTILITY: REAL-TIME PROJECT TRANSPARENCY</p>
                  <p className="text-sm font-display font-bold text-gray-400 uppercase leading-tight mb-4">"THE LIVE JOB-SITE"</p>
                  <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                    Homeowners can log in to see a live gallery of today's progress, view permits, and sign off on change orders instantly from their phone. This eliminates the "What's happening?" phone calls and builds a reputation for absolute reliability.
                  </p>
                </div>
                <div className="p-8 glass rounded-xl group transition-all hover:border-[#00F0FF]/30">
                  <div className="flex items-center gap-4 mb-6">
                    <Briefcase className="text-[#CCFF00]" size={24} />
                    <h5 className="text-lg font-display font-bold text-white uppercase tracking-tight">PROFESSIONAL SERVICES</h5>
                  </div>
                  <p className="text-[10px] font-body text-[#CCFF00] uppercase mb-4 font-bold">UTILITY: SECURED DOCUMENT ARCHITECTURE</p>
                  <p className="text-sm font-display font-bold text-gray-400 uppercase leading-tight mb-4">"THE CLIENT VAULT"</p>
                  <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                    Lawyers and Accountants can provide clients a 256-bit encrypted space to upload sensitive financial data or legal briefs. Automated milestone tracking shows the client exactly where their case or audit stands, significantly reducing "Just checking in" emails.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-8 glass rounded-xl group transition-all hover:border-[#00F0FF]/30">
                  <div className="flex items-center gap-4 mb-6">
                    <FileCheck className="text-[#CCFF00]" size={24} />
                    <h5 className="text-lg font-display font-bold text-white uppercase tracking-tight">CONSULTANTS & COACHES</h5>
                  </div>
                  <p className="text-[10px] font-body text-[#CCFF00] uppercase mb-4 font-bold">UTILITY: ASSET DELIVERY & ACCOUNTABILITY</p>
                  <p className="text-sm font-display font-bold text-gray-400 uppercase leading-tight mb-4">"THE CURATED CURRICULUM"</p>
                  <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                    Your clients get a personalized dashboard containing their recorded sessions, PDF worksheets, and a progress tracker. Integrated billing allows them to renew subscriptions or book their next 1-on-1 session without leaving your ecosystem.
                  </p>
                </div>
                <div className="p-8 glass rounded-xl group transition-all hover:border-[#00F0FF]/30">
                  <div className="flex items-center gap-4 mb-6">
                    <ClipboardList className="text-[#CCFF00]" size={24} />
                    <h5 className="text-lg font-display font-bold text-white uppercase tracking-tight">MARKETING AGENCIES</h5>
                  </div>
                  <p className="text-[10px] font-body text-[#CCFF00] uppercase mb-4 font-bold">UTILITY: APPROVAL & PERFORMANCE TRACKING</p>
                  <p className="text-sm font-display font-bold text-gray-400 uppercase leading-tight mb-4">"THE ROI COMMAND CENTER"</p>
                  <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                    Provide clients a real-time view of their ad spend, lead volume, and creative proofs. They can approve new campaign visuals with one click, speeding up production cycles and making the value you provide undeniable.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#CCFF00] text-black rounded-xl">
              <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight">
                BENEFIT: YOU ARE NO LONGER AN "EXPENSE"—YOU ARE A "PARTNER." A custom portal elevates your brand from a commodity service to an elite, high-trust tech-enabled experience.
              </p>
            </div>
          </div>
        )
      },
      {
        id: 'content-prod',
        title: 'CINEMA PRODUCTION',
        blurb: 'Hollywood Grade Creative Tools.',
        icon: <MonitorPlay size={20} />,
        content: (
          <div className="space-y-10">
            <div>
              <h4 className="text-2xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-none mb-6">THE CREATIVE SUITE</h4>
              <p className="text-sm lg:text-lg font-display font-medium text-white/70 uppercase leading-relaxed tracking-wide border-l-4 border-[#CCFF00] pl-6 mb-8">
                I don't just "make videos." I provide <span className="text-white">Visual Authority</span>. Most business content looks like a home video—my work looks like a Netflix original series.
              </p>
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 p-6 glass rounded-xl">
                <div className="flex items-center gap-8">
                  <SoftwareItem software={softwareData.davinci} onClick={() => onShowSoftware(softwareData.davinci)} />
                  <SoftwareItem software={softwareData.dehancer} onClick={() => onShowSoftware(softwareData.dehancer)} />
                  <SoftwareItem software={softwareData.topaz} onClick={() => onShowSoftware(softwareData.topaz)} />
                  <SoftwareItem software={softwareData.higgsfield} onClick={() => onShowSoftware(softwareData.higgsfield)} />
                </div>
                <div className="bg-[#CCFF00] px-6 py-3 rounded-lg shrink-0">
                  <p className="text-white font-display font-bold text-[9px] uppercase tracking-widest text-center leading-tight">
                    CLICK AN APPLICATION <br /> FOR MORE INFO
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/20">
              <div className="space-y-4">
                <h5 className="text-[#CCFF00] font-body text-[10px] font-bold uppercase tracking-[0.3em]">THE REALTOR / DEVELOPER</h5>
                <p className="text-xs font-display font-bold text-white/90 uppercase leading-tight">THE MULTI-MILLION DOLLAR FEEL</p>
                <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                  We turn a standard property walk-through into a cinematic experience. High-end color grading makes the light feel warm and inviting, literally adding perceived thousands to a home's value.
                </p>
              </div>
              <div className="space-y-4">
                <h5 className="text-[#CCFF00] font-body text-[10px] font-bold uppercase tracking-[0.3em]">THE MEDICAL / ELITE CLINIC</h5>
                <p className="text-xs font-display font-bold text-white/90 uppercase leading-tight">TRUST THROUGH PRECISION</p>
                <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                  We capture your clinic with anamorphic lenses. This makes the environment look high-tech, world-class, and surgical. Customers choose you because they trust your tools before they even meet you.
                </p>
              </div>
              <div className="space-y-4">
                <h5 className="text-[#CCFF00] font-body text-[10px] font-bold uppercase tracking-[0.3em]">THE RESTAURANT / BAR</h5>
                <p className="text-xs font-display font-bold text-white/90 uppercase leading-tight">THE CHEF'S TABLE EFFECT</p>
                <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                  Slow-motion, macro shots of your food mastered in 4K. We make a simple burger look like a work of art, driving massive cravings and foot traffic.
                </p>
              </div>
              <div className="space-y-4">
                <h5 className="text-[#CCFF00] font-body text-[10px] font-bold uppercase tracking-[0.3em]">E-COMMERCE / RETAIL</h5>
                <p className="text-xs font-display font-bold text-white/90 uppercase leading-tight">THE APPLE STANDARD</p>
                <p className="text-[11px] font-body text-gray-400 uppercase leading-relaxed">
                  Product ads that look like Apple commercials. Crisp, clean, and perfectly colored. When the video is perfect, the customer assumes the product is perfect, too.
                </p>
              </div>
            </div>
            <div className="p-6 bg-[#CCFF00] text-black rounded-xl">
              <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight">
                BOTTOM LINE: I use the exact same software used on movies like Avatar and Deadpool. You get Hollywood quality that makes your competition look "small time" by comparison.
              </p>
            </div>
          </div>
        )
      }
    ],
    hardware: [
      {
        id: 'workstation',
        title: 'THE NEURAL FOUNDRY',
        blurb: 'Pure Computational Horsepower.',
        icon: <Server size={20} />,
        content: (
          <div className="space-y-6">
            <h4 className="text-2xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">NVIDIA WORK-STATION</h4>
            <div className="p-6 bg-[#CCFF00] text-black rounded-xl mb-6">
              <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight">
                PLAIN ENGLISH: I own the heavy-duty computers that other agencies have to "rent" from the cloud. This means I can finish your work in minutes while they're still waiting.
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-sm lg:text-lg font-display font-medium text-white/70 uppercase leading-relaxed tracking-wide border-l-4 border-[#CCFF00] pl-6">
                This isn't just a computer; it's a <span className="text-white">localized supercomputer</span> designed for the AI era. By processing everything on-site, we eliminate data latency, security risks of third-party clouds, and the massive overhead costs that traditional agencies hide in their invoices.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="p-6 glass rounded-xl flex items-center gap-4">
                <Zap className="text-[#CCFF00]" size={24} />
                <div>
                  <span className="text-[9px] font-body text-gray-400 uppercase block mb-1">GPU</span>
                  <span className="text-sm lg:text-lg font-display font-bold text-white uppercase">RTX 4090 24GB VRAM</span>
                </div>
              </div>
              <div className="p-6 glass rounded-xl flex items-center gap-4">
                <Cpu className="text-[#CCFF00]" size={24} />
                <div>
                  <span className="text-[9px] font-body text-gray-400 uppercase block mb-1">CPU</span>
                  <span className="text-sm lg:text-lg font-display font-bold text-white uppercase">RYZEN 7800X3D</span>
                </div>
              </div>
              <div className="p-6 glass rounded-xl flex items-center gap-4">
                <Layers className="text-[#CCFF00]" size={24} />
                <div>
                  <span className="text-[9px] font-body text-gray-400 uppercase block mb-1">RAM</span>
                  <span className="text-sm lg:text-lg font-display font-bold text-white uppercase">128GB DDR5 6000MHz</span>
                </div>
              </div>
              <div className="p-6 glass rounded-xl flex items-center gap-4 sm:col-span-2">
                <HardDrive className="text-[#CCFF00]" size={24} />
                <div>
                  <span className="text-[9px] font-body text-gray-400 uppercase block mb-1">NVME STORAGE</span>
                  <span className="text-sm lg:text-lg font-display font-bold text-white uppercase">WD BLACK 14GBPS</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#CCFF00] text-black rounded-xl">
              <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight">
                BOTTOM LINE: Superior hardware equals superior speed. You get elite, large-agency results with small-agency agility and zero "render-tax" overhead.
              </p>
            </div>
          </div>
        )
      },
      {
        id: 'filmmaking',
        title: 'RED DIGITAL CINEMA',
        blurb: 'Hollywood Capture Systems.',
        icon: <Video size={20} />,
        content: (
          <div className="space-y-10">
            <div>
              <h4 className="text-2xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-none mb-6">RED ECOSYSTEM: THE HOLLYWOOD STANDARD</h4>
              <div className="p-6 glass rounded-xl mb-8">
                <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight text-white">
                  PLAIN ENGLISH: I use the exact same camera brand that shot "The Social Network," "Avatar," and "Deadpool." Your business isn't "small time"—it's an epic story.
                </p>
              </div>
              <p className="text-sm lg:text-lg font-display font-medium text-white/70 uppercase leading-relaxed tracking-wide border-l-4 border-[#CCFF00] pl-6 mb-10">
                A "Cinematic Mini-Documentary" is the single most powerful asset a business can own. When your content looks like a Netflix Original, people stop questioning your price and start respecting your authority.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {[
                { src: "https://images.red.com/komodo-x/kx-rf-main-features-2x.jpg", label: "KOMODO-X 6K CHASSIS" },
                { src: "https://images.red.com/komodo-x/slide-media-blk.png", label: "NATIVE NARRATIVE MEDIA" },
                { src: "https://images.red.com/komodo-x/interface-expansion-blk.png", label: "CONTROL INTERFACE" },
                { src: "https://images.red.com/komodo-x/slide-io-array-blk.png", label: "STUDIO CONNECTIVITY" },
              ].map((img, i) => (
                <div key={i} className="aspect-video relative group overflow-hidden rounded-xl border border-white/20 bg-black cursor-pointer" onClick={() => onShowImage(img.src)}>
                  <img src={img.src} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" alt={img.label} />
                  <div className="absolute bottom-2 left-2 text-[8px] font-body font-bold text-[#CCFF00] uppercase bg-black/60 px-2 py-1 rounded">{img.label}</div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-[#CCFF00] text-black rounded-xl">
              <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight text-center">
                WHY THIS MATTERS: IF YOUR BUSINESS LOOKS LIKE A MOVIE, CUSTOMERS TREAT YOU LIKE A STAR.
              </p>
            </div>
          </div>
        )
      },
      {
        id: 'optical-glass',
        title: 'ANAMORPHIC GLASS',
        blurb: 'The Soul is in the Lens.',
        icon: <Eye size={20} />,
        content: (
          <div className="space-y-12">
            <div>
              <h4 className="text-2xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-none mb-6">SIRUI SATURN SERIES: THE ANAMORPHIC ADVANTAGE</h4>
              <div className="p-6 bg-[#CCFF00] text-black rounded-xl mb-8">
                <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight">
                  PLAIN ENGLISH: Regular lenses look like a "Zoom call." These lenses look like a "Netflix Movie." Our brains are hard-wired to respect the wide perspective and horizontal blue flares found in Hollywood's greatest films.
                </p>
              </div>
              <p className="text-sm lg:text-lg font-display font-medium text-white/70 uppercase leading-relaxed tracking-wide border-l-4 border-[#CCFF00] pl-6 mb-10">
                For over 70 years, the most prestigious films have utilized anamorphic glass to convey scale, emotion, and prestige. When we use the Sirui Saturn Series on your brand story, we are elevating your business to "Main Character" status.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[2.4/1] w-full bg-black rounded-xl border border-white/20 overflow-hidden">
                <iframe src="https://www.youtube.com/embed/RLwo8clXyZM" title="Anamorphic Showcase" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[9px] font-body text-[#CCFF00] uppercase tracking-widest font-bold">SHOT ON SIRUI SATURN ANAMORPHIC</span>
                <span className="text-[9px] font-body text-gray-400 uppercase tracking-widest">2.4:1 ASPECT RATIO</span>
              </div>
            </div>
            <div className="p-8 glass rounded-xl border-l-4 border-[#CCFF00]">
              <span className="text-[9px] font-body text-[#CCFF00] uppercase block mb-2 font-bold">THE TECHNICAL SIGNATURE</span>
              <span className="text-[10px] font-display font-bold text-white uppercase tracking-widest leading-relaxed">
                HORIZONTAL STRETCH // OVAL BOKEH // CINEMATIC BLUE FLARES // 2.4:1 ASPECT RATIO
              </span>
            </div>
          </div>
        )
      },
      {
        id: 'gimbal-lidar',
        title: 'GIMBAL & LIDAR',
        blurb: 'Surgical Motion Control.',
        icon: <Move size={20} />,
        content: (
          <div className="space-y-12">
            <div>
              <h4 className="text-2xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter leading-none mb-6">DJI RS3 PRO & LIDAR FOCUS</h4>
              <div className="p-6 bg-[#CCFF00] text-black rounded-xl mb-8">
                <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight">
                  PLAIN ENGLISH: Handheld video often looks shaky and cheap. We use laser-guided robots to float our cameras through your space, ensuring every shot is smooth as silk and perfectly in focus.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                "https://www.diyphotography.net/wp-content/uploads/2024/04/dji-rs4-rs4pro-focuspro.jpg",
                "https://nilo-production.s3.amazonaws.com/images/listing_images/images/3335/original/open-uri20220811-20801-14h7l9a?1660221671",
                "https://nilo-production.s3.amazonaws.com/images/listing_images/images/3336/original/open-uri20220811-20801-lwvstm?1660221674"
              ].map((url, i) => (
                <div key={i} className="aspect-[3/4] relative group overflow-hidden rounded-xl border border-white/20 bg-black cursor-pointer" onClick={() => onShowImage(url)}>
                  <img src={url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100" alt="Gimbal & Lidar Gear" />
                </div>
              ))}
            </div>
            <div className="p-8 glass rounded-xl border-l-4 border-[#CCFF00] flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="text-[9px] font-body text-[#CCFF00] uppercase block mb-2 font-bold">HARDWARE SPECIFICATION</span>
                <span className="text-[10px] font-display font-bold text-white uppercase tracking-widest leading-relaxed">
                  DJI RS3 PRO // LIDAR FOCUS PRO // CARBON FIBER CONSTRUCTION
                </span>
              </div>
              <div className="bg-[#CCFF00] text-black px-6 py-4 font-display font-bold text-[10px] uppercase tracking-widest rounded-lg">
                PRECISION MOTION ACTIVE
              </div>
            </div>
          </div>
        )
      }
    ]
  };

  const currentItems = armoryData[activeCategory];
  const selectedData = currentItems[activeItem];

  return (
    <div className="pt-20 pb-12 md:py-20 lg:py-32">
      {/* MOBILE */}
      <div className="md:hidden px-4">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none mb-2">THE ARMORY</h2>
          <p className="text-[9px] font-body text-[#CCFF00] tracking-[0.3em] uppercase">HIGH-END PRODUCTION</p>
        </div>
        <div className="flex glass-nav p-1 mb-4">
          <button onClick={() => { setActiveCategory('software'); setActiveItem(0); }} className={`flex-1 py-3 text-[10px] font-display font-bold uppercase rounded-lg transition-all ${activeCategory === 'software' ? 'bg-[#CCFF00] text-black' : 'text-gray-400'}`}>SOFTWARE</button>
          <button onClick={() => { setActiveCategory('hardware'); setActiveItem(0); }} className={`flex-1 py-3 text-[10px] font-display font-bold uppercase rounded-lg transition-all ${activeCategory === 'hardware' ? 'bg-[#CCFF00] text-black' : 'text-gray-400'}`}>HARDWARE</button>
        </div>
        <div className="space-y-2">
          {currentItems.map((item, idx) => (
            <div key={item.id} id={`accordion-${item.id}`} className="glass rounded-xl overflow-hidden scroll-mt-20">
              <button
                onClick={() => { if (activeItem !== idx) { setActiveItem(idx); setTimeout(() => { document.getElementById(`accordion-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 200); } }}
                className={`w-full p-4 flex items-center justify-between text-left transition-all rounded-xl ${activeItem === idx ? 'bg-[#CCFF00] text-black' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={activeItem === idx ? 'text-black' : 'text-[#CCFF00]'}>{item.icon}</div>
                  <span className={`text-sm font-display font-bold uppercase tracking-tight ${activeItem === idx ? 'text-black' : 'text-white'}`}>{item.title}</span>
                </div>
                <ChevronRight className={`transition-transform ${activeItem === idx ? 'rotate-90 text-black' : 'text-gray-400'}`} size={18} />
              </button>
              {isMobile ? (
                activeItem === idx && <div className="p-4 border-t border-white/20">{item.content}</div>
              ) : (
                <AnimatePresence>
                  {activeItem === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="p-4 border-t border-white/20">{item.content}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 p-5 text-center bg-[#CCFF00] rounded-xl">
          <h3 className="text-lg font-display font-bold uppercase tracking-tight mb-2 text-black">SEE THIS IN ACTION?</h3>
          <p className="text-[10px] font-body font-bold uppercase mb-4 text-black/60">FREE 30-MIN CONSULT + FREE VIDEO</p>
          <button onClick={onConsultation} className="w-full py-4 bg-black text-white font-display font-bold text-[11px] tracking-[0.2em] uppercase rounded-lg">BOOK NOW</button>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto glass-strong p-6 lg:p-8 relative z-10 rounded-2xl glow-cyan">
          <div className="relative z-10 mb-12 flex flex-row items-center justify-between gap-6">
            <div>
              <h2 ref={armoryRef} className="text-4xl lg:text-7xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">THE ARMORY</h2>
              <p className="text-[10px] font-body text-gray-400 tracking-[0.5em] uppercase mt-2">HIGH-END PRODUCTION AT A FRACTION OF THE COST</p>
            </div>
            <div className="flex glass-nav p-1">
              <button onClick={() => { setActiveCategory('software'); setActiveItem(0); }} className={`px-8 py-3 text-[10px] font-display font-bold uppercase rounded-lg transition-all ${activeCategory === 'software' ? 'bg-[#CCFF00] text-black' : 'text-gray-400 hover:text-white'}`}>SOFTWARE ASSETS</button>
              <button onClick={() => { setActiveCategory('hardware'); setActiveItem(0); }} className={`px-8 py-3 text-[10px] font-display font-bold uppercase rounded-lg transition-all ${activeCategory === 'hardware' ? 'bg-[#CCFF00] text-black' : 'text-gray-400 hover:text-white'}`}>HARDWARE POWER</button>
            </div>
          </div>

          <div className="relative z-10 glass overflow-hidden flex flex-row h-[650px] lg:h-[750px] rounded-xl border-t-4 border-[#CCFF00]">
            <div className="w-80 lg:w-96 border-r border-white/20 flex flex-col shrink-0">
              <div className="flex-1 overflow-y-auto no-scrollbar py-4">
                {currentItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveItem(idx)}
                    className={`w-full p-6 lg:p-8 text-left transition-all border-b border-gray-100 flex gap-6 items-start group ${activeItem === idx ? 'bg-black/[0.05] border-l-4 border-l-[#CCFF00]' : 'hover:bg-black/[0.02]'}`}
                  >
                    <div className={`mt-1 transition-colors ${activeItem === idx ? 'text-[#CCFF00]' : 'text-gray-500'}`}>{item.icon}</div>
                    <div>
                      <h4 className={`text-sm lg:text-lg font-display font-bold uppercase tracking-tight mb-2 ${activeItem === idx ? 'gradient-text' : 'text-gray-400'}`}>{item.title}</h4>
                      <p className={`text-[10px] font-body font-medium uppercase tracking-tight leading-tight ${activeItem === idx ? 'text-gray-400' : 'text-gray-500'}`}>{item.blurb}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-8 lg:p-16">
              <AnimatePresence mode="wait">
                <motion.div key={selectedData.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                  {selectedData.content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative z-10 mt-12 p-8 lg:p-12 text-center bg-[#CCFF00] rounded-xl">
            <h3 className="text-2xl lg:text-4xl font-display font-extrabold uppercase tracking-tighter mb-4 text-black">WANT TO SEE THIS IN ACTION?</h3>
            <p className="text-sm lg:text-base font-display font-bold uppercase tracking-tight mb-6 text-black/70">
              GIVE ME 30 MINUTES. I'LL SHOW YOU WHAT AI CAN DO FOR YOUR BUSINESS—AND YOU GET A FREE VIDEO SHOT ON MY RED CAMERA. NO STRINGS.
            </p>
            <button onClick={onConsultation} className="inline-flex items-center gap-4 px-10 py-5 bg-black text-white font-display font-bold text-xs tracking-[0.3em] uppercase rounded-lg hover:bg-white hover:text-black transition-all">
              BOOK FREE CONSULTATION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoPortfolio = ({ onConsultation, onShowSoftware, onShowImage }: { onConsultation: () => void, onShowSoftware: (s: SoftwareInfo) => void, onShowImage: (src: string) => void }) => {
  const cinematicsRef = useRef<HTMLHeadingElement>(null);
  
  const projects = [
    { id: "RLwo8clXyZM", title: "THE SUPREME BARBERSHOP YYC", company: "KALEB BRUNNING", tech: ["Dynamic Text", "Fast Cuts"], impact: "300% Engagement", description: "Fast-paced, high-energy brand showcase for Calgary's premier grooming destination, focusing on precision, style, and the art of the cut." },
    { id: "gxeU_tq7jH8", title: "SURVIVING THE SILENCE", company: "PETER HERBIG", tech: ["AI Voice", "Smart Editing"], impact: "Massive Viral Reach", description: "A gripping cinematic exploration of resilience and the human spirit, captured with raw emotional intensity and high-end visual storytelling." },
    { id: "2D6Dc7Pa_1s", title: "NATEFIT", company: "NATHANIEL ERNST", tech: ["Visual Data", "Auto-Clips"], impact: "Easier Client Onboarding", description: "A dynamic fitness journey documentary highlighting the transformational power of dedicated coaching and the strength of the YYC community." },
    { id: "1a7M7Np5g10", title: "SPRING CLEANUP COMMERCIAL", company: "K&M LANDSCAPING", tech: ["Dynamic Montage", "Local SEO Focus"], impact: "High Conversion Booking", description: "Transforming outdoor spaces into living art. A visual seasonal journey showcasing the mastery and evolution of premium Calgary landscapes." },
    { id: "RLUiuSgi0zU", title: "MAD BUILDERS", company: "MAD HOUSE", tech: ["Home Data Injection"], impact: "Cheaper Lead Costs", description: "Behind the scenes of architectural mastery, capturing the grit, precision, and glory involved in crafting high-end custom residential builds." },
    { id: "Up0lNvLU230", title: "I AM MATHEW", company: "MAD HOUSE", tech: ["Cinematic AI", "Sound Design"], impact: "Deep Emotional Impact", description: "An intimate and evocative cinematic portrait exploring personal identity through the specialized lens of modern digital creativity." },
  ];

  const [activeProject, setActiveProject] = useState(projects[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
      <div className="mb-12 sm:mb-20">
        <div className="flex flex-col gap-10 lg:gap-16">
          <div className="w-full text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 sm:w-12 h-[1px] bg-[#CCFF00]" />
              <span className="text-[9px] sm:text-[10px] font-body tracking-[0.4em] text-[#CCFF00] uppercase font-bold">HIGH-END DOCUMENTARY</span>
              <div className="w-8 sm:w-12 h-[1px] bg-[#CCFF00]" />
            </div>
            <h2 ref={cinematicsRef} className="text-[1.85rem] sm:text-4xl md:text-5xl lg:text-[6rem] xl:text-[7rem] 2xl:text-[8rem] font-display font-black text-white uppercase tracking-tighter leading-none mb-4">CINEMATICS.</h2>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-10 sm:space-y-12">
              <div className="flex flex-col items-center gap-0 text-center">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-display font-bold text-white uppercase tracking-wide">
                  AI POWERS THE SCALE.
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-display font-bold uppercase tracking-wide gradient-text">
                  CINEMA CAPTURES THE SOUL.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 text-center lg:text-left">
                <div className="space-y-6">
                  <p className="text-base sm:text-lg lg:text-xl font-display font-medium text-white/90 uppercase leading-snug tracking-tight">
                    As exciting as it is to be AI-powered, what really makes it all work is remembering that you are still serving a <span className="gradient-text">human audience</span>.
                  </p>
                  <p className="text-xs sm:text-sm font-body font-bold text-gray-400 uppercase leading-relaxed">
                    The most powerful evergreen marketing tool is a high-end cinematic mini-documentary. We humanize your brand through artistic interview footage and Hollywood-grade B-roll.
                  </p>
                </div>
                <div className="space-y-6 lg:border-l lg:border-white/20 lg:pl-10">
                  <div className="space-y-5">
                    <div className="flex flex-col items-center lg:flex-row lg:items-start gap-3">
                      <BookOpen className="text-[#CCFF00] shrink-0" size={18} />
                      <div>
                        <p className="text-xs font-display font-bold text-white uppercase mb-1">HERITAGE BRANDING</p>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase leading-relaxed font-bold">This isn't just an advertisement. It's a legacy piece that grows in value as your company matures.</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center lg:flex-row lg:items-start gap-3">
                      <Crown className="text-[#CCFF00] shrink-0" size={18} />
                      <div>
                        <p className="text-xs font-display font-bold text-white uppercase mb-1">UNMATCHED AUTHORITY</p>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase leading-relaxed font-bold">The visual texture of Hollywood cinema bypasses the natural skepticism of modern leads.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Player Grid */}
              <div id="hero-video-player" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-12 scroll-mt-20">
                <div className="lg:col-span-8">
                  <div className="relative group cursor-pointer aspect-video overflow-hidden rounded-xl border border-white/20 bg-black glow-cyan" onClick={() => setIsModalOpen(true)}>
                    <img src={`https://img.youtube.com/vi/${activeProject.id}/maxresdefault.jpg`} className="w-full h-full object-cover transition-all duration-700" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 border border-white/40 flex items-center justify-center rounded-full group-hover:bg-[#CCFF00] group-hover:border-[#CCFF00] transition-all">
                        <Play className="text-white group-hover:text-black ml-1" size={32} />
                      </div>
                    </div>
                  </div>
                  <motion.div key={activeProject.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-10 lg:p-12 glass rounded-xl text-left">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse" />
                      <span className="text-[10px] font-body tracking-[0.3em] text-[#CCFF00] uppercase font-bold">CASE STUDY</span>
                    </div>
                    <h4 className="text-xl sm:text-2xl lg:text-4xl font-display font-extrabold text-white uppercase tracking-tighter mb-4 leading-tight">{activeProject.title}</h4>
                    <p className="text-sm sm:text-base lg:text-lg font-body font-medium text-gray-400 uppercase leading-relaxed tracking-wide">{activeProject.description}</p>
                    <div className="mt-6 sm:mt-8 flex flex-wrap gap-4">
                      <span className="px-3 py-1 glass text-[8px] sm:text-[9px] font-body text-[#CCFF00] uppercase tracking-widest font-bold rounded-lg whitespace-nowrap">PROJECT FOR: {activeProject.company}</span>
                    </div>
                  </motion.div>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <div className="space-y-2 sm:space-y-3">
                    {projects.map(p => (
                      <button key={p.id} onClick={() => {
                        setActiveProject(p);
                        if (window.innerWidth < 1024) setTimeout(() => { document.getElementById('hero-video-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
                      }} className={`w-full p-3 sm:p-5 text-left rounded-xl border transition-all flex items-center justify-between group ${activeProject.id === p.id ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'glass text-white hover:border-white/20'}`}>
                        <div className="min-w-0">
                          <p className={`text-[8px] sm:text-[9px] font-body font-bold uppercase mb-0.5 sm:mb-1 ${activeProject.id === p.id ? 'text-black/40' : 'text-gray-400'}`}>{p.company}</p>
                          <p className="font-display font-bold uppercase text-[11px] sm:text-sm truncate">{p.title}</p>
                        </div>
                        <ChevronRight size={14} className={`shrink-0 transition-transform ${activeProject.id === p.id ? 'translate-x-1' : ''}`} />
                      </button>
                    ))}
                  </div>
                  <button onClick={onConsultation} className="w-full py-5 sm:py-8 btn-primary text-[10px] sm:text-xs tracking-[0.2em] mt-3 sm:mt-4">
                    BOOK A CHAT
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isModalOpen && <VideoModal id={activeProject.id} title={activeProject.title} onClose={() => setIsModalOpen(false)} />}
              </AnimatePresence>

              {/* Hollywood Advantage */}
              <div className="w-full pt-10">
                <div className="glass-strong overflow-hidden rounded-2xl text-left">
                  <div className="glass-strong p-6 sm:p-10 lg:p-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-10 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                      <span className="text-[9px] sm:text-[10px] font-body tracking-[0.3em] sm:tracking-[0.5em] text-white/70 uppercase font-bold block mb-4 sm:mb-6 px-2 sm:px-3 py-1 bg-white/10 inline-block rounded">NARRATIVE-DRIVEN BRAND STORIES</span>
                      <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-extrabold text-white uppercase tracking-tighter leading-[0.85] mb-4 sm:mb-6">THE HOLLYWOOD <br className="hidden sm:block" /> ADVANTAGE.</h4>
                      <p className="text-sm sm:text-base lg:text-xl font-display font-bold text-white/80 uppercase tracking-tight max-w-xl leading-snug">
                        WE USE THE SAME TOOLS AS <span className="text-red-600">NETFLIX MASTERPIECES</span>. WHY? BECAUSE YOUR BUSINESS DESERVES TO LOOK LIKE A GLOBAL LEADER, NOT A STARTUP.
                      </p>
                    </div>
                    <div className="relative z-10 flex flex-col items-start sm:items-end w-full sm:w-auto">
                      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-black text-white font-body font-bold text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-xl flex flex-col items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <span className="opacity-60 text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em]">PRODUCTION SOFTWARE</span>
                        <div className="flex items-center gap-2">
                          <SoftwareItem software={softwareData.davinci} onClick={() => onShowSoftware(softwareData.davinci)} />
                          <SoftwareItem software={softwareData.dehancer} onClick={() => onShowSoftware(softwareData.dehancer)} />
                          <SoftwareItem software={softwareData.higgsfield} onClick={() => onShowSoftware(softwareData.higgsfield)} />
                          <SoftwareItem software={softwareData.topaz} onClick={() => onShowSoftware(softwareData.topaz)} />
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
                          <div className="aspect-video relative overflow-hidden rounded-xl border border-white/20 bg-black cursor-pointer group" onClick={() => onShowImage("https://images.red.com/komodo-x/kx-rf-main-features-2x.jpg")}>
                            <img src="https://images.red.com/komodo-x/kx-rf-main-features-2x.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" alt="RED Komodo-X" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8">
                              <span className="text-[9px] sm:text-[10px] font-body font-bold text-[#CCFF00] uppercase block mb-1 sm:mb-2">MADE IN CALIFORNIA</span>
                              <p className="text-base sm:text-xl lg:text-2xl font-display font-extrabold text-white uppercase tracking-tighter">RED KOMODO-X 6K CINEMA CAMERA</p>
                            </div>
                          </div>
                        </div>
                        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left">
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

                    {/* Sirui Saturn Anamorphic Section */}
                    <div className="space-y-8 sm:space-y-12 border-b border-gray-100 pb-10 sm:pb-16">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
                        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1">
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
                          <div className="aspect-video relative overflow-hidden rounded-xl border border-white/20 bg-black cursor-pointer group mb-6" onClick={() => onShowImage("https://cdn.shopifycdn.net/s/files/1/0449/9344/6037/files/v1-1.jpg?v=1677661259")}>
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

                    {/* DJI RS3 Pro & LiDAR Section */}
                    <div className="space-y-8 sm:space-y-12 border-b border-gray-100 pb-10 sm:pb-16">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12">
                        <div className="lg:col-span-7">
                          <div className="aspect-video relative overflow-hidden rounded-xl border border-white/20 bg-black cursor-pointer group mb-6" onClick={() => onShowImage("https://www.diyphotography.net/wp-content/uploads/2024/04/dji-rs4-rs4pro-focuspro-928x522.jpg")}>
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
                        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left">
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

                    {/* Footer CTA */}
                    <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
                      <div className="max-w-3xl">
                        <h4 className="text-2xl sm:text-3xl lg:text-5xl font-display font-extrabold text-white uppercase tracking-tighter leading-none mb-4 sm:mb-6">
                          NETFLIX QUALITY. <span className="text-gray-400">MINUS THE EGO.</span>
                        </h4>
                        <p className="text-[11px] sm:text-xs lg:text-sm font-display font-bold text-gray-400 uppercase leading-relaxed mb-6 sm:mb-10">
                          Traditional Hollywood agencies charge $50k+ for this setup. By leveraging AI and keeping our team lean, I deliver Cinematic Masterworks for a fraction of the cost.
                        </p>
                        <button onClick={onConsultation} className="btn-primary px-8 sm:px-12 py-4 sm:py-6 text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em]">
                          SECURE YOUR CINEMATIC AUDIT
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC<{ onStart: () => void, onConsultation: () => void, scrollProgress?: number, scrollDirection?: 'forward' | 'backward' }> = ({ onStart, onConsultation, scrollProgress = 1 }) => {
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [showOperatorDeepDive, setShowOperatorDeepDive] = useState(false);
  const [expandedHelpIndex, setExpandedHelpIndex] = useState<number | null>(null);
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareInfo | null>(null);
  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(null);
  const { isMobile, fadeProps } = useMobileAnimations();

  // Track if hero has been fully visible (high water mark)
  // Once fully visible, any fade-out should move UP (exit animation)
  const hasReachedFullVisibility = useRef(false);

  const helpAccordionItems = [
    { title: "SILENT WORKERS", desc: "AI agents that handle your emails and tasks.", icon: <Bot size={16} className="text-[#CCFF00] mt-1 shrink-0" />, explanation: "Digital employees that never sleep. They triage your inbox, handle initial customer inquiries, and perform data entry with 100% accuracy, freeing you to focus on high-level strategy and growth." },
    { title: "SMOOTH PIPELINES", desc: "Data that flows from one app to another automatically.", icon: <GitBranch size={16} className="text-[#CCFF00] mt-1 shrink-0" />, explanation: "We connect your entire tech stack into a single, cohesive engine. Data moves frictionlessly from lead capture to CRM to billing, eliminating manual copy-pasting and human error forever." },
    { title: "CONSTANT GROWTH", desc: "Systems that find and talk to leads non-stop.", icon: <TrendingUp size={16} className="text-[#CCFF00] mt-1 shrink-0" />, explanation: "A 24/7 lead generation machine. Our tools identify ideal prospects, initiate personalized outreach, and book qualified appointments directly into your calendar while you sleep." }
  ];

  // Hero content animation - symmetric easing for clean forward/reverse
  const heroContentRaw = Math.max(0, Math.min(1, (scrollProgress - 0.70) / 0.30));
  const heroContentEased = heroContentRaw < 0.5
    ? 4 * heroContentRaw * heroContentRaw * heroContentRaw
    : 1 - Math.pow(-2 * heroContentRaw + 2, 3) / 2;

  // Track high water mark - once hero is fully visible, exits should move UP
  if (heroContentEased > 0.95) {
    hasReachedFullVisibility.current = true;
  }
  // Reset when fully exited (allows re-entrance animation)
  if (heroContentEased < 0.05) {
    hasReachedFullVisibility.current = false;
  }

  // Calculate translateY: entrance rises from below (+20→0), exit rises up (0→-20)
  const isExiting = hasReachedFullVisibility.current && heroContentEased < 0.95;
  const heroTranslateY = isExiting
    ? (1 - heroContentEased) * -20  // Exit: content rises UP and out
    : (1 - heroContentEased) * 20;   // Entrance: content rises UP from below

  return (
    <div className="relative">
      {/* Calgary Diorama Hero Section - Fixed background with overlay */}
      {/* Height is 250vh - animations complete as section ends, no dead zone */}
      <div className="relative w-screen h-[250vh] -mx-4 sm:-mx-6 lg:-mx-12 -mt-24 lg:-mt-28">
        {/* Fixed Diorama Image - stays in place while scrolling */}
        {/* bg-neutral-100 prevents white flash before image loads */}
        {/* pointer-events-none allows scroll events to pass through */}
        {/* Mobile-only diorama fallback (desktop uses Room3D picture frame) */}
        {isMobile && (
          <div
            className="fixed inset-0 z-[2] bg-neutral-100 pointer-events-none"
            style={{ opacity: scrollProgress >= 0.5 ? 0 : 1 }}
          >
            <img
              src="/calgary-diorama-mobile.jpg"
              alt="Calgary Skyline Diorama"
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}


        {/* Scroll hint - fades out as you scroll */}
        <div
          className="absolute bottom-[12%] lg:bottom-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 3) }}
        >
          <span className="text-[10px] font-body tracking-[0.3em] text-black/50 uppercase">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-black/40 flex items-start justify-center p-1 animate-bounce-slow">
            <div className="w-1 h-2 bg-black/60 rounded-full" />
          </div>
        </div>

        {/* Hero Content - fades in LAST (0.70-1.0) with subtle rise */}
        {/* Uses heroContentEased computed above for symmetric forward/reverse animation */}
        <div
          className="sticky top-0 h-screen flex items-center justify-center z-20 px-4 sm:px-6 lg:px-12"
          style={{
            opacity: isMobile ? 1 : heroContentEased,
            transform: isMobile ? 'none' : `translateY(${heroTranslateY}px)`,
            pointerEvents: scrollProgress > 0.85 ? 'auto' : 'none',
            willChange: 'transform, opacity',
          }}
        >
          <div className="max-w-7xl w-full mx-auto">
            <div className="flex flex-col items-start justify-center relative">
          <div className="z-10 w-full text-left">
            <div>
              <div className="mb-3 lg:mb-2 flex items-center gap-3 cursor-pointer group" onClick={() => setShowOperatorDeepDive(true)}>
                <div className="w-8 h-[2px] bg-[#CCFF00]" />
                <span className="text-[8px] sm:text-[10px] font-body tracking-[0.25em] sm:tracking-[0.3em] uppercase font-bold block leading-tight group-hover:underline text-[#00F0FF]">
                  HOW I HELP YOU GROW [?]
                </span>
              </div>
              <ProximityHeroText />
              <div className="text-[3vw] sm:text-base md:text-lg lg:text-lg xl:text-xl text-white mb-5 lg:mb-4 leading-snug font-display font-medium border-l-2 border-[#00F0FF] pl-4 sm:pl-6 flex flex-col items-start gap-0.5 text-stroke">
                <span className="block sm:whitespace-nowrap"><span className="text-[#00F0FF]">AI</span> IS CHANGING <span className="text-[#00F0FF]">EVERYTHING</span>.</span>
                <span className="block sm:whitespace-nowrap">YOUR <span className="text-[#00F0FF]">COMPETITION</span> IS ALREADY <span className="text-[#00F0FF]">PREPARING</span>.</span>
                <span className="block sm:whitespace-nowrap">I'M HERE TO MAKE SURE YOU <span className="text-[#00F0FF]">GET THERE FIRST</span>.</span>
              </div>
              <div className="flex flex-row sm:flex-wrap gap-3 sm:gap-4 mb-3 lg:mb-4">
                <button onClick={onStart} className="flex-1 sm:flex-none btn-primary px-4 py-2.5 sm:px-8 sm:py-4 text-[10px] sm:text-[11px] tracking-[0.15em]">
                  <span className="sm:hidden">DISCOVER</span>
                  <span className="hidden sm:inline">SEE MY PROCESS</span>
                </button>
                <button onClick={() => portfolioRef.current?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 sm:flex-none btn-glass px-4 py-2.5 sm:px-8 sm:py-4 text-[10px] sm:text-[11px] tracking-[0.15em]">
                  <span className="sm:hidden">CINEMATICS</span>
                  <span className="hidden sm:inline">VIEW CINEMATICS</span>
                </button>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>

      <TheArmory onShowSoftware={(s) => setSelectedSoftware(s)} onShowImage={(src) => setSelectedFullImage(src)} onConsultation={onConsultation} />

      <div ref={portfolioRef} className="py-20 border-t border-white/20">
        <VideoPortfolio onConsultation={onConsultation} onShowSoftware={(s) => setSelectedSoftware(s)} onShowImage={(src) => setSelectedFullImage(src)} />
      </div>

      {/* Meet Sal CTA */}
      <div className="py-16 sm:py-24 border-t border-white/20">
        <div className="text-center max-w-3xl mx-auto px-4">
          <span className="text-[10px] font-body tracking-[0.5em] text-[#CCFF00] uppercase font-bold block mb-4">INDEPENDENT AI OPERATOR & FILMMAKER</span>
          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white uppercase tracking-tighter leading-none mb-6">SO WHO IS THIS SAL GUY ANYWAY?</h3>
          <p className="text-sm sm:text-base font-display font-medium text-gray-400 uppercase tracking-tight mb-8 max-w-xl mx-auto">
            THE FACE BEHIND THE TECH. THE HUMAN BEHIND THE AUTOMATION. GET TO KNOW YOUR NEW BUSINESS PAL.
          </p>
          <button onClick={onStart} className="btn-glass px-8 py-4 sm:px-12 sm:py-5 text-xs sm:text-sm tracking-[0.2em]">MEET SALMAN</button>
        </div>
      </div>

      {/* Operator Deep Dive Modal */}
      <AnimatePresence>
        {showOperatorDeepDive && (
          <motion.div {...fadeProps} className="fixed inset-0 z-[300] flex items-center justify-center p-4 lg:p-8 bg-black/95 backdrop-blur-3xl">
            <div className="max-w-4xl w-full glass-strong p-8 lg:p-16 border-t-4 border-[#CCFF00] max-h-[90vh] overflow-y-auto no-scrollbar relative rounded-2xl shadow-2xl">
              <button onClick={() => setShowOperatorDeepDive(false)} className="absolute top-6 right-6 lg:top-8 lg:right-8 text-gray-400 hover:text-white transition-colors"><X size={32} /></button>
              <div className="mb-10 lg:mb-12">
                <span className="text-[10px] font-body tracking-[1em] text-[#00F0FF] uppercase font-bold block mb-4">THE SAL METHOD</span>
                <h3 className="text-3xl lg:text-6xl font-display font-extrabold text-white uppercase tracking-tighter leading-none mb-6">WHY WORK <br />WITH ME?</h3>
                <div className="h-1 w-24 bg-gradient-to-r from-[#CCFF00] to-[#00F0FF] rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-6">
                  <div className="p-6 glass rounded-xl">
                    <h4 className="text-xl font-display font-bold text-white uppercase mb-4 tracking-tight">MY GOAL</h4>
                    <p className="text-sm font-body font-medium text-gray-400 uppercase leading-relaxed tracking-tight">
                      I DON'T JUST SELL TOOLS. I BUILD CUSTOM SYSTEMS THAT WORK IN THE BACKGROUND SO YOU CAN FOCUS ON WHAT YOU ACTUALLY LOVE DOING.
                    </p>
                  </div>
                  <div className="p-6 bg-[#CCFF00] text-black rounded-xl">
                    <h4 className="text-xl font-display font-bold uppercase mb-4 tracking-tight">THE DIFFERENCE</h4>
                    <p className="text-[11px] font-body font-bold uppercase tracking-widest leading-tight">
                      MOST PEOPLE USE APPS. I BUILD THE ENGINES THAT CONNECT YOUR APPS, EMPLOYEES, AND CUSTOMERS TOGETHER.
                    </p>
                  </div>
                </div>
                <div className="space-y-6 lg:space-y-8">
                  <span className="text-[10px] font-body text-gray-400 uppercase tracking-widest block font-bold">WHAT YOU GET</span>
                  <div className="space-y-4">
                    {helpAccordionItems.map((m, i) => (
                      <div key={i} onClick={() => setExpandedHelpIndex(expandedHelpIndex === i ? null : i)} className="cursor-pointer glass rounded-xl overflow-hidden hover:border-white/20 transition-all">
                        <div className="flex gap-4 p-4 items-start">
                          {m.icon}
                          <div className="flex-1">
                            <p className="text-[11px] font-display font-bold text-black uppercase mb-1">{m.title}</p>
                            <p className="text-[9px] font-body font-bold text-gray-400 uppercase tracking-widest">{m.desc}</p>
                          </div>
                          <ChevronRight size={14} className={`text-[#CCFF00] mt-1 transition-transform ${expandedHelpIndex === i ? 'rotate-90' : ''}`} />
                        </div>
                        <AnimatePresence>
                          {expandedHelpIndex === i && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 border-t border-white/20">
                              <p className="pt-3 text-[10px] font-body font-medium text-gray-400 uppercase leading-relaxed tracking-tight">{m.explanation}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedSoftware && <SoftwareDetailModal software={selectedSoftware} onClose={() => setSelectedSoftware(null)} />}
      </AnimatePresence>
      <ImageModal src={selectedFullImage} onClose={() => setSelectedFullImage(null)} />
    </div>
  );
};
