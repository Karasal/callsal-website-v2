import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Link, ShieldCheck, MonitorPlay, Server, Video, Eye, Move,
  Zap, Cpu, Layers, HardDrive, Hammer, Briefcase, FileCheck, ClipboardList, ChevronRight
} from 'lucide-react';
import { ModuleContentProps } from '../../types/modules';

interface ArmoryModuleProps extends ModuleContentProps {
  isPreview?: boolean; // true = scaled-down card preview, false = full interactive
  onShowSoftware?: (s: SoftwareInfo) => void;
  onShowImage?: (src: string) => void;
}

interface SoftwareInfo {
  name: string;
  logo: string;
  description: string;
  features: string[];
}

// Software data for the detail modal
const softwareData: Record<string, SoftwareInfo> = {
  davinci: { name: 'DaVinci Resolve Studio', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/DaVinci_Resolve_17_logo.svg', description: 'Hollywood-standard color grading and editing', features: ['Neural Engine AI', 'HDR Grading', 'Fusion VFX'] },
  dehancer: { name: 'Dehancer Pro', logo: 'https://dehancer.com/wp-content/uploads/2023/11/logo-dehancer.svg', description: 'Analog film emulation', features: ['Film Stocks', 'Halation', 'Grain'] },
  topaz: { name: 'Topaz Video AI', logo: 'https://www.topazlabs.com/images/topaz-logo.svg', description: 'AI upscaling and enhancement', features: ['4K→8K Upscale', 'Frame Interpolation', 'Noise Reduction'] },
  higgsfield: { name: 'Higgsfield AI', logo: 'https://higgsfield.ai/logo.svg', description: 'AI video generation', features: ['Text-to-Video', 'Style Transfer', 'Motion Synthesis'] }
};

const SoftwareItem = ({ software, onClick }: { software: SoftwareInfo; onClick: () => void }) => (
  <button onClick={onClick} className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-all">
    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
      <MonitorPlay size={16} className="text-[#CCFF00]" />
    </div>
    <span className="text-[8px] font-body text-gray-400 uppercase">{software.name.split(' ')[0]}</span>
  </button>
);

export const ArmoryModule: React.FC<ArmoryModuleProps> = ({
  isPreview = false,
  onClose,
  onConsultation,
  onShowSoftware,
  onShowImage
}) => {
  const [activeCategory, setActiveCategory] = useState<'software' | 'hardware'>('software');
  const [activeItem, setActiveItem] = useState(0);

  const armoryData = {
    software: [
      {
        id: 'agentic-logic',
        title: 'AI HELPER BOTS',
        blurb: 'Autonomous Thinking Machines.',
        icon: <Brain size={isPreview ? 12 : 20} />,
      },
      {
        id: 'automation-glue',
        title: 'WORKFLOW AUTOMATION',
        blurb: 'The Invisible Glue of Success.',
        icon: <Link size={isPreview ? 12 : 20} />,
      },
      {
        id: 'customer-ops',
        title: 'CUSTOM CRM DEVELOPMENT',
        blurb: 'Bespoke Business Command Centers.',
        icon: <ShieldCheck size={isPreview ? 12 : 20} />,
      },
      {
        id: 'content-prod',
        title: 'CINEMA PRODUCTION',
        blurb: 'Hollywood Grade Creative Tools.',
        icon: <MonitorPlay size={isPreview ? 12 : 20} />,
      }
    ],
    hardware: [
      {
        id: 'workstation',
        title: 'THE NEURAL FOUNDRY',
        blurb: 'Pure Computational Horsepower.',
        icon: <Server size={isPreview ? 12 : 20} />,
      },
      {
        id: 'filmmaking',
        title: 'RED DIGITAL CINEMA',
        blurb: 'Hollywood Capture Systems.',
        icon: <Video size={isPreview ? 12 : 20} />,
      },
      {
        id: 'optical-glass',
        title: 'ANAMORPHIC GLASS',
        blurb: 'The Soul is in the Lens.',
        icon: <Eye size={isPreview ? 12 : 20} />,
      },
      {
        id: 'gimbal-lidar',
        title: 'GIMBAL & LIDAR',
        blurb: 'Surgical Motion Control.',
        icon: <Move size={isPreview ? 12 : 20} />,
      }
    ]
  };

  const currentItems = armoryData[activeCategory];
  const selectedData = currentItems[activeItem];

  // Preview mode - simplified mini version for 3D card
  if (isPreview) {
    return (
      <div className="w-full h-full bg-black/90 p-3 flex flex-col overflow-hidden">
        {/* Mini header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-display font-bold text-white uppercase tracking-tight">THE ARMORY</h3>
          <div className="flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveCategory('software'); setActiveItem(0); }}
              className={`px-2 py-0.5 text-[6px] font-display font-bold uppercase rounded ${activeCategory === 'software' ? 'bg-[#CCFF00] text-black' : 'text-gray-400'}`}
            >
              SW
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveCategory('hardware'); setActiveItem(0); }}
              className={`px-2 py-0.5 text-[6px] font-display font-bold uppercase rounded ${activeCategory === 'hardware' ? 'bg-[#CCFF00] text-black' : 'text-gray-400'}`}
            >
              HW
            </button>
          </div>
        </div>

        {/* Mini item list */}
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          {currentItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={(e) => { e.stopPropagation(); setActiveItem(idx); }}
              className={`flex items-center gap-2 p-1.5 rounded text-left transition-all ${activeItem === idx ? 'bg-[#CCFF00]/20 border-l-2 border-[#CCFF00]' : 'hover:bg-white/5'}`}
            >
              <div className={activeItem === idx ? 'text-[#CCFF00]' : 'text-gray-500'}>{item.icon}</div>
              <div className="min-w-0 flex-1">
                <p className={`text-[7px] font-display font-bold uppercase truncate ${activeItem === idx ? 'text-[#CCFF00]' : 'text-gray-300'}`}>{item.title}</p>
                <p className="text-[5px] text-gray-500 uppercase truncate">{item.blurb}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Mini CTA */}
        <div className="mt-2 p-1.5 bg-[#CCFF00] rounded text-center">
          <p className="text-[6px] font-display font-bold text-black uppercase">CLICK TO EXPLORE</p>
        </div>
      </div>
    );
  }

  // Full interactive mode - complete Armory UI
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">THE ARMORY</h2>
          <p className="text-[10px] font-body text-gray-400 tracking-[0.5em] uppercase mt-2">HIGH-END PRODUCTION AT A FRACTION OF THE COST</p>
        </div>
        <div className="flex glass-nav p-1">
          <button
            onClick={() => { setActiveCategory('software'); setActiveItem(0); }}
            className={`px-6 py-2 text-[9px] font-display font-bold uppercase rounded-lg transition-all ${activeCategory === 'software' ? 'bg-[#CCFF00] text-black' : 'text-gray-400 hover:text-white'}`}
          >
            SOFTWARE
          </button>
          <button
            onClick={() => { setActiveCategory('hardware'); setActiveItem(0); }}
            className={`px-6 py-2 text-[9px] font-display font-bold uppercase rounded-lg transition-all ${activeCategory === 'hardware' ? 'bg-[#CCFF00] text-black' : 'text-gray-400 hover:text-white'}`}
          >
            HARDWARE
          </button>
        </div>
      </div>

      {/* Content grid */}
      <div className="glass overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[550px] rounded-xl border-t-4 border-[#CCFF00]">
        {/* Sidebar */}
        <div className="lg:w-72 border-b lg:border-b-0 lg:border-r border-white/20 flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto no-scrollbar py-2">
            {currentItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(idx)}
                className={`w-full p-4 lg:p-6 text-left transition-all border-b border-white/10 flex gap-4 items-start group ${activeItem === idx ? 'bg-black/20 border-l-4 border-l-[#CCFF00]' : 'hover:bg-black/10'}`}
              >
                <div className={`mt-1 transition-colors ${activeItem === idx ? 'text-[#CCFF00]' : 'text-gray-500'}`}>{item.icon}</div>
                <div>
                  <h4 className={`text-sm font-display font-bold uppercase tracking-tight mb-1 ${activeItem === idx ? 'gradient-text' : 'text-gray-400'}`}>{item.title}</h4>
                  <p className={`text-[9px] font-body font-medium uppercase tracking-tight leading-tight ${activeItem === idx ? 'text-gray-400' : 'text-gray-500'}`}>{item.blurb}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedData.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArmoryContent categoryId={selectedData.id} onShowSoftware={onShowSoftware} onShowImage={onShowImage} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 p-6 lg:p-8 text-center bg-[#CCFF00] rounded-xl">
        <h3 className="text-xl lg:text-2xl font-display font-extrabold uppercase tracking-tighter mb-3 text-black">WANT TO SEE THIS IN ACTION?</h3>
        <p className="text-xs font-display font-bold uppercase tracking-tight mb-4 text-black/70">
          FREE 30-MIN CONSULT + FREE VIDEO SHOT ON MY RED CAMERA
        </p>
        <button
          onClick={() => { onClose(); onConsultation?.(); }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-display font-bold text-xs tracking-[0.2em] uppercase rounded-lg hover:bg-white hover:text-black transition-all"
        >
          BOOK FREE CONSULTATION
        </button>
      </div>
    </div>
  );
};

// Content for each armory item
const ArmoryContent: React.FC<{ categoryId: string; onShowSoftware?: (s: SoftwareInfo) => void; onShowImage?: (src: string) => void }> = ({ categoryId, onShowSoftware, onShowImage }) => {
  const content: Record<string, React.ReactNode> = {
    'agentic-logic': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">DUPLICATE YOURSELF</h4>
        <div className="p-4 bg-[#CCFF00] text-black rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight">
            PLAIN ENGLISH: I build "digital brains" that can read your emails, understand your business rules, and make decisions just like a trained employee would.
          </p>
        </div>
        <p className="text-sm font-body font-medium text-gray-400 uppercase leading-relaxed tracking-wide">
          We leverage <span className="text-[#4285F4]">Gemini 3 Pro</span> and <span className="text-[#E07A5F]">Claude Opus 4.5</span> to build agents that don't just chat—they orchestrate.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          {['REAL ESTATE', 'E-COMMERCE', 'PROFESSIONAL SERVICES', 'LOCAL TRADES'].map(industry => (
            <div key={industry} className="space-y-1">
              <span className="text-[8px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">{industry}</span>
              <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">Automated decision-making that never sleeps.</p>
            </div>
          ))}
        </div>
      </div>
    ),
    'automation-glue': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">SYMPHONY BRIDGES</h4>
        <div className="p-4 glass rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight text-white">
            PLAIN ENGLISH: I connect your CRM, your Inbox, and your Invoices so they talk to each other. No more copy-pasting.
          </p>
        </div>
        <p className="text-sm font-display font-medium text-white/70 uppercase leading-relaxed tracking-wide border-l-4 border-[#CCFF00] pl-4">
          Think of your business like a train track. I build the automatic switches.
        </p>
      </div>
    ),
    'customer-ops': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">THE OPERATIONS VAULT</h4>
        <div className="p-4 glass rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight text-white">
            PLAIN ENGLISH: I build a private "portal" for your business. Your clients can log in, see their progress, and pay you.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Hammer, title: 'CONTRACTORS', desc: 'Real-time project transparency' },
            { icon: Briefcase, title: 'PROFESSIONALS', desc: 'Secured document vault' },
            { icon: FileCheck, title: 'CONSULTANTS', desc: 'Asset delivery & accountability' },
            { icon: ClipboardList, title: 'AGENCIES', desc: 'Approval & ROI tracking' }
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-4 glass rounded-xl">
              <Icon className="text-[#CCFF00] mb-2" size={18} />
              <p className="text-[9px] font-display font-bold text-white uppercase">{title}</p>
              <p className="text-[8px] text-gray-400 uppercase">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    'content-prod': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">THE CREATIVE SUITE</h4>
        <p className="text-sm font-display font-medium text-white/70 uppercase leading-relaxed tracking-wide border-l-4 border-[#CCFF00] pl-4">
          I don't just "make videos." I provide Visual Authority. My work looks like a Netflix original series.
        </p>
        <div className="flex gap-4 p-4 glass rounded-xl">
          {Object.values(softwareData).map(sw => (
            <SoftwareItem key={sw.name} software={sw} onClick={() => onShowSoftware?.(sw)} />
          ))}
        </div>
      </div>
    ),
    'workstation': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">NVIDIA WORKSTATION</h4>
        <div className="p-4 bg-[#CCFF00] text-black rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight">
            PLAIN ENGLISH: I own the heavy-duty computers that other agencies have to "rent." I finish your work in minutes.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Zap, label: 'GPU', value: 'RTX 4090 24GB' },
            { icon: Cpu, label: 'CPU', value: 'RYZEN 7800X3D' },
            { icon: Layers, label: 'RAM', value: '128GB DDR5' },
            { icon: HardDrive, label: 'STORAGE', value: 'WD BLACK 14GBPS' }
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-3 glass rounded-xl flex items-center gap-3">
              <Icon className="text-[#CCFF00]" size={18} />
              <div>
                <span className="text-[8px] font-body text-gray-400 uppercase block">{label}</span>
                <span className="text-[10px] font-display font-bold text-white uppercase">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    'filmmaking': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">RED ECOSYSTEM</h4>
        <div className="p-4 glass rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight text-white">
            PLAIN ENGLISH: The exact same camera that shot "Avatar" and "Deadpool." Your business is an epic story.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { src: "https://images.red.com/komodo-x/kx-rf-main-features-2x.jpg", label: "KOMODO-X 6K" },
            { src: "https://images.red.com/komodo-x/slide-media-blk.png", label: "NATIVE MEDIA" },
          ].map((img, i) => (
            <div key={i} className="aspect-video relative group overflow-hidden rounded-xl border border-white/20 bg-black cursor-pointer" onClick={() => onShowImage?.(img.src)}>
              <img src={img.src} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" alt={img.label} />
              <div className="absolute bottom-1 left-1 text-[7px] font-body font-bold text-[#CCFF00] uppercase bg-black/60 px-1 py-0.5 rounded">{img.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    'optical-glass': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">SIRUI SATURN SERIES</h4>
        <div className="p-4 bg-[#CCFF00] text-black rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight">
            PLAIN ENGLISH: Regular lenses look like a "Zoom call." These lenses look like a "Netflix Movie."
          </p>
        </div>
        <div className="p-4 glass rounded-xl border-l-4 border-[#CCFF00]">
          <span className="text-[9px] font-display font-bold text-white uppercase tracking-widest">
            HORIZONTAL STRETCH // OVAL BOKEH // CINEMATIC BLUE FLARES // 2.4:1 ASPECT RATIO
          </span>
        </div>
      </div>
    ),
    'gimbal-lidar': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">DJI RS3 PRO & LIDAR</h4>
        <div className="p-4 bg-[#CCFF00] text-black rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight">
            PLAIN ENGLISH: Laser-guided robots float our cameras through your space. Every shot is smooth as silk.
          </p>
        </div>
        <div className="p-4 glass rounded-xl border-l-4 border-[#CCFF00]">
          <span className="text-[9px] font-display font-bold text-white uppercase tracking-widest">
            DJI RS3 PRO // LIDAR FOCUS PRO // CARBON FIBER CONSTRUCTION
          </span>
        </div>
      </div>
    )
  };

  return content[categoryId] || <p className="text-gray-400">Content not found</p>;
};

export default ArmoryModule;
