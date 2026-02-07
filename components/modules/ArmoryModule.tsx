import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Link, ShieldCheck, MonitorPlay, Server, Video, Eye, Move,
  Zap, Cpu, Layers, HardDrive, Hammer, Briefcase, FileCheck, ClipboardList, ChevronRight,
  Search, Clapperboard, Globe
} from 'lucide-react';
import { ModuleContentProps } from '../../types/modules';

// Brutalist Cyberpunk Knight Emblem - Sword, Shield & Helmet (from v1)
const ArmoryEmblem = ({ size = 40, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M8 8L24 4L40 8V24C40 32 32 40 24 44C16 40 8 32 8 24V8Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    <path d="M12 11L24 8L36 11V23C36 29 30 35 24 38C18 35 12 29 12 23V11Z" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" strokeLinejoin="bevel" />
    <path d="M16 16H32L30 20H18L16 16Z" fill="currentColor" fillOpacity="0.3" />
    <path d="M18 17H30" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <path d="M24 6V14" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    <path d="M24 18V42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    <path d="M18 26H30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    <path d="M23 30H25M23 33H25M23 36H25" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
    <path d="M24 18L26 22M24 18L22 22" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    <path d="M14 14L14 20M34 14L34 20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2" />
  </svg>
);

interface ArmoryModuleProps extends ModuleContentProps {
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
  davinci: { name: 'DaVinci Resolve Studio', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio.png', description: 'Hollywood-standard color grading and editing', features: ['Neural Engine AI', 'HDR Grading', 'Fusion VFX'] },
  dehancer: { name: 'Dehancer Pro', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/55/DehancerAppLogo.png?20240122135855', description: 'Analog film emulation', features: ['Film Stocks', 'Halation', 'Grain'] },
  topaz: { name: 'Topaz Video AI', logo: 'https://cdn.prod.website-files.com/6005fac27a49a9cd477afb63/68af97376fbc83545d307491_icon-topaz-video.svg', description: 'AI upscaling and enhancement', features: ['4K→8K Upscale', 'Frame Interpolation', 'Noise Reduction'] },
  higgsfield: { name: 'Higgsfield AI', logo: '/higgsfield-logo.svg', description: 'AI video generation', features: ['Text-to-Video', 'Style Transfer', 'Motion Synthesis'] }
};

const SoftwareItem = ({ software, onClick }: { software: SoftwareInfo; onClick: () => void }) => (
  <button onClick={onClick} className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/10 transition-all">
    <img src={software.logo} className="h-10 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity" alt={software.name} />
    <span className="text-[8px] font-body text-gray-400 uppercase group-hover:text-white transition-colors">{software.name.split(' ')[0]}</span>
  </button>
);

export const ArmoryModule: React.FC<ArmoryModuleProps> = ({
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
        icon: <Brain size={20} />,
      },
      {
        id: 'automation-glue',
        title: 'WORKFLOW AUTOMATION',
        blurb: 'The Invisible Glue of Success.',
        icon: <Link size={20} />,
      },
      {
        id: 'customer-ops',
        title: 'CUSTOM CRM DEVELOPMENT',
        blurb: 'Bespoke Business Command Centers.',
        icon: <ShieldCheck size={20} />,
      },
      {
        id: 'content-prod',
        title: 'CINEMA PRODUCTION',
        blurb: 'Hollywood Grade Creative Tools.',
        icon: <MonitorPlay size={20} />,
      },
      {
        id: 'content-factory',
        title: 'CONTENT FACTORY',
        blurb: 'One Shoot, 100+ Posts.',
        icon: <Clapperboard size={20} />,
      },
      {
        id: 'scout-bots',
        title: 'FIND CUSTOMERS',
        blurb: 'Outreach on Autopilot.',
        icon: <Search size={20} />,
      }
    ],
    hardware: [
      {
        id: 'workstation',
        title: 'THE NEURAL FOUNDRY',
        blurb: 'Pure Computational Horsepower.',
        icon: <Server size={20} />,
      },
      {
        id: 'filmmaking',
        title: 'RED DIGITAL CINEMA',
        blurb: 'Hollywood Capture Systems.',
        icon: <Video size={20} />,
      },
      {
        id: 'optical-glass',
        title: 'ANAMORPHIC GLASS',
        blurb: 'The Soul is in the Lens.',
        icon: <Eye size={20} />,
      },
      {
        id: 'gimbal-lidar',
        title: 'GIMBAL & LIDAR',
        blurb: 'Surgical Motion Control.',
        icon: <Move size={20} />,
      }
    ]
  };

  const currentItems = armoryData[activeCategory];
  const selectedData = currentItems[activeItem];

  // Full interactive mode - complete Armory UI
  return (
    <div className="px-6 pt-6 pb-2 lg:px-8 lg:pt-8 lg:pb-2">
      {/* Header */}
      <div className="mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ArmoryEmblem className="text-[#CCFF00]" size={40} />
          <div>
            <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">THE ARMORY</h2>
            <p className="text-[10px] font-body text-gray-400 tracking-[0.5em] uppercase mt-2">HIGH-END PRODUCTION AT A FRACTION OF THE COST</p>
          </div>
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
      <div className="glass overflow-hidden flex flex-col lg:flex-row rounded-xl border-t-4 border-[#CCFF00]">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ArmoryContent categoryId={selectedData.id} onShowSoftware={onShowSoftware} onShowImage={onShowImage} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tagline */}
      <div className="mt-4 p-3 glass rounded-xl border-l-4 border-[#CCFF00]">
        <p className="text-[9px] font-display font-bold text-white/70 uppercase tracking-widest">
          TRADITIONAL AGENCIES SPEND YOUR MONEY ON FANCY OFFICE RENT. I SPEND IT ON HIGH-END COMPUTE AND OPTICS. YOU GET THE POWER WITHOUT THE TAX.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-4 p-4 lg:p-6 text-center bg-[#CCFF00] rounded-xl">
        <h3 className="text-xl lg:text-2xl font-display font-extrabold uppercase tracking-tighter mb-3 text-black">WANT TO SEE THIS IN ACTION?</h3>
        <p className="text-xs font-display font-bold uppercase tracking-tight mb-4 text-black/70">
          GIVE ME 30 MINUTES. I'LL SHOW YOU WHAT AI CAN DO FOR YOUR BUSINESS — AND YOU GET A FREE VIDEO SHOT ON MY RED CAMERA. NO STRINGS.
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
          We leverage <span className="text-[#4285F4]">Gemini Pro</span> and <span className="text-[#E07A5F]">Claude Opus Max</span> to build agents that don't just chat—they orchestrate. These engines process complex context, use external tools, and follow multi-step instructions autonomously.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 glass rounded-xl flex flex-col items-center text-center gap-3">
            <img src="/claude-logo.webp" className="h-10 w-auto object-contain" alt="Claude" />
            <div>
              <p className="text-[10px] font-display font-bold text-[#E07A5F] uppercase">CLAUDE OPUS MAX</p>
              <p className="text-[8px] font-body text-gray-400 uppercase tracking-wider mt-1">BY ANTHROPIC</p>
              <p className="text-[8px] font-body text-gray-500 uppercase leading-tight mt-2">Deep reasoning, complex orchestration, and multi-step autonomous task execution.</p>
            </div>
          </div>
          <div className="p-4 glass rounded-xl flex flex-col items-center text-center gap-3">
            <img src="/gemini-logo.webp" className="h-10 w-auto object-contain" alt="Gemini" />
            <div>
              <p className="text-[10px] font-display font-bold text-[#4285F4] uppercase">GEMINI PRO</p>
              <p className="text-[8px] font-body text-gray-400 uppercase tracking-wider mt-1">BY GOOGLE</p>
              <p className="text-[8px] font-body text-gray-500 uppercase leading-tight mt-2">Massive context windows, real-time data access, and native Google ecosystem integration.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          {[
            { title: 'REAL ESTATE', desc: 'Instantly qualifies leads from platforms like Zillow, checks your calendar, and books tours based on property location and traffic patterns.' },
            { title: 'E-COMMERCE', desc: 'Handles "where is my order?" queries by actually checking shipping APIs and issuing partial refunds for delays — without you lifting a finger.' },
            { title: 'PROFESSIONAL SERVICES', desc: 'Scans legal documents for risk clauses or summarizes 50+ page discovery files into 5 high-impact bullet points for your morning review.' },
            { title: 'LOCAL TRADES', desc: 'Reviews photos of a job site sent via SMS, calculates a rough material cost based on market rates, and sends a preliminary quote 24/7.' },
          ].map(({ title, desc }) => (
            <div key={title} className="space-y-1">
              <span className="text-[8px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">{title}</span>
              <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">{desc}</p>
            </div>
          ))}
        </div>
        <div className="p-3 glass rounded-xl border-l-4 border-[#CCFF00]">
          <span className="text-[9px] font-display font-bold text-[#CCFF00] uppercase tracking-widest">BENEFIT: UNLIMITED BRAINPOWER</span>
          <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold mt-1">These agents never sleep, never get bored, and their capacity is limited only by your imagination. They are the ultimate force-multiplier for a lean, high-profit team.</p>
        </div>
      </div>
    ),
    'automation-glue': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">SYMPHONY BRIDGES</h4>
        <div className="p-4 glass rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight text-white">
            PLAIN ENGLISH: I connect your CRM, your Inbox, and your Invoices so they talk to each other. When something happens in one place, everything else updates automatically. No more copy-pasting.
          </p>
        </div>
        <p className="text-sm font-body font-medium text-gray-400 uppercase leading-relaxed tracking-wide">
          Think of your business like a train track. Right now, you're the one manually switching the tracks for every single train (task). I build the automatic switches. When a new customer emails you, the system automatically writes down their info, tells your team, and sets a reminder to call them back. You don't have to lift a finger — the train just stays on the track.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          {[
            { title: 'THE REAL ESTATE AGENT', subtitle: '"THE INSTANT HANDOFF"', desc: 'A lead comes in from Zillow. Instead of you finding it 4 hours later in your noisy inbox, the system sees it, adds it to your contact list, and texts you their phone number and "must-have" list instantly. You\'re calling them while they\'re still on the property page.' },
            { title: 'THE ONLINE SHOP', subtitle: '"THE LOYALTY ENGINE"', desc: 'A sale happens. The system tells your shipping app to print a label, tells your accounting app to record the tax, and sends the customer a customized "welcome" video from you. It then waits 7 days and asks them for a review. You never touched a button.' },
            { title: 'THE LOCAL TRADESMAN', subtitle: '"THE PROJECT PROMOTER"', desc: 'You finish a job and snap a photo. The system puts that photo on your website as a "recent work" post, updates your Instagram, and sends the customer a link to leave a 5-star review. Your marketing is done before you\'ve even left the driveway.' },
            { title: 'PROFESSIONAL SERVICES', subtitle: '"THE CLIENT ONBOARDER"', desc: 'An invoice is paid. The system automatically creates a new folder in Google Drive for the client, drafts the contract, and notifies your operations manager to start the intake. All the paperwork is ready before you even finish your coffee.' },
          ].map(({ title, subtitle, desc }) => (
            <div key={title} className="space-y-1">
              <span className="text-[8px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">{title}</span>
              <span className="text-[8px] font-display font-bold text-white/50 uppercase block">{subtitle}</span>
              <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    'customer-ops': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">THE OPERATIONS VAULT</h4>
        <div className="p-4 glass rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight text-white">
            PLAIN ENGLISH: I build a private "portal" for your business. Your clients can log in, see their progress, and pay you — all in one clean, professional place that builds massive trust.
          </p>
        </div>
        <p className="text-sm font-body font-medium text-gray-400 uppercase leading-relaxed tracking-wide">
          A custom hub removes the chaos of email chains and lost attachments. It provides a single, secured "source of truth" for your clients, making you look like a tech-forward industry leader while reducing administrative friction.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          {[
            { icon: Hammer, title: 'THE MODERN CONTRACTOR', subtitle: '"THE LIVE JOB-SITE"', utility: 'Real-time project transparency', desc: 'Homeowners can log in to see a live gallery of today\'s progress, view permits, and sign off on change orders instantly from their phone. This eliminates the "what\'s happening?" phone calls and builds a reputation for absolute reliability.' },
            { icon: Briefcase, title: 'PROFESSIONAL SERVICES', subtitle: '"THE CLIENT VAULT"', utility: 'Secured document architecture', desc: 'Lawyers and accountants can provide clients a 256-bit encrypted space to upload sensitive financial data or legal briefs. Automated milestone tracking shows the client exactly where their case or audit stands, significantly reducing "just checking in" emails.' },
            { icon: FileCheck, title: 'CONSULTANTS & COACHES', subtitle: '"THE CURATED CURRICULUM"', utility: 'Asset delivery & accountability', desc: 'Your clients get a personalized dashboard containing their recorded sessions, PDF worksheets, and a progress tracker. Integrated billing allows them to renew subscriptions or book their next 1-on-1 session without leaving your ecosystem.' },
            { icon: ClipboardList, title: 'MARKETING AGENCIES', subtitle: '"THE ROI COMMAND CENTER"', utility: 'Approval & performance tracking', desc: 'Provide clients a real-time view of their ad spend, lead volume, and creative proofs. They can approve new campaign visuals with one click, speeding up production cycles and making the value you provide undeniable.' },
          ].map(({ icon: Icon, title, subtitle, utility, desc }) => (
            <div key={title} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="text-[#CCFF00]" size={16} />
                <span className="text-[8px] font-body text-[#CCFF00] uppercase font-bold tracking-widest">{title}</span>
              </div>
              <span className="text-[8px] font-display font-bold text-white/50 uppercase block">{subtitle}</span>
              <span className="text-[7px] font-body text-white/40 uppercase block tracking-widest">UTILITY: {utility}</span>
              <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">{desc}</p>
            </div>
          ))}
        </div>
        <div className="p-3 glass rounded-xl border-l-4 border-[#CCFF00]">
          <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">
            <span className="text-[#CCFF00]">BENEFIT:</span> You are no longer an "expense" — you are a "partner." A custom portal elevates your brand from a commodity service to an elite, high-trust tech-enabled experience.
          </p>
        </div>
      </div>
    ),
    'content-prod': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">THE CREATIVE SUITE</h4>
        <div className="p-4 bg-[#CCFF00] text-black rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight">
            PLAIN ENGLISH: I don't just "make videos." I provide Visual Authority. Most business content looks like a home video — my work looks like a Netflix original series.
          </p>
        </div>
        <div className="flex gap-4 p-4 glass rounded-xl">
          {Object.values(softwareData).map(sw => (
            <SoftwareItem key={sw.name} software={sw} onClick={() => onShowSoftware?.(sw)} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          {[
            { title: 'REALTOR / DEVELOPER', subtitle: '"THE MULTI-MILLION DOLLAR FEEL"', desc: 'Property walk-through becomes a cinematic experience with high-end color grading. Perceived value of the listing increases dramatically.' },
            { title: 'MEDICAL / ELITE CLINIC', subtitle: '"TRUST THROUGH PRECISION"', desc: 'Anamorphic lenses create a "high-tech, world-class, surgical" environment on camera. Removes the scary clinic vibe and replaces it with authority.' },
            { title: 'RESTAURANT / BAR', subtitle: '"THE CHEF\'S TABLE EFFECT"', desc: 'Slow-motion, macro shots of food preparation. Makes a simple burger look like art. Drives cravings and foot traffic.' },
            { title: 'E-COMMERCE / RETAIL', subtitle: '"THE APPLE STANDARD"', desc: 'Product ads that look like Apple commercials. Builds instant trust — customers assume the product is as perfect as the presentation.' },
          ].map(({ title, subtitle, desc }) => (
            <div key={title} className="space-y-1">
              <span className="text-[8px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">{title}</span>
              <span className="text-[8px] font-display font-bold text-white/50 uppercase block">{subtitle}</span>
              <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">{desc}</p>
            </div>
          ))}
        </div>
        <div className="p-3 glass rounded-xl border-l-4 border-[#CCFF00]">
          <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">
            <span className="text-[#CCFF00]">BENEFIT:</span> You get Hollywood quality that makes your competition look "small time" by comparison.
          </p>
        </div>
      </div>
    ),
    'content-factory': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">THE CONTENT FACTORY</h4>
        <div className="p-4 bg-[#CCFF00] text-black rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight">
            PLAIN ENGLISH: We film for 60 minutes once a month. My robots chop that into 100+ Reels, TikToks, and LinkedIn posts — with captions, music, and your logo. All automatic.
          </p>
        </div>
        <p className="text-sm font-display font-medium text-white/70 uppercase leading-relaxed tracking-wide border-l-4 border-[#CCFF00] pl-4">
          One filming session. 100+ pieces of premium content. AI handles editing, captions, music sync, and viral hooks — while you run your business.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          {[
            { title: 'REAL ESTATE', desc: 'One walkthrough → 10 Reels, 5 YouTube videos, 20 Facebook posts.' },
            { title: 'LOCAL TRADES', desc: 'Job photo → Before/After video, auto-posted to Google Business.' },
            { title: 'MEDICAL & DENTAL', desc: 'Patient questions → professional video library using your AI voice.' },
            { title: 'FITNESS & COACHING', desc: 'Workout clips → high-energy motivational ads with AI music sync.' },
          ].map(({ title, desc }) => (
            <div key={title} className="space-y-1">
              <span className="text-[8px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">{title}</span>
              <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">{desc}</p>
            </div>
          ))}
        </div>
        <div className="p-3 glass rounded-xl border-l-4 border-[#CCFF00]">
          <span className="text-[9px] font-display font-bold text-[#CCFF00] uppercase tracking-widest">ESTIMATED LIFT: 80% MORE ENGAGEMENT</span>
        </div>
      </div>
    ),
    'scout-bots': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">SCOUT BOT ARMY</h4>
        <div className="p-4 bg-[#CCFF00] text-black rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight">
            PLAIN ENGLISH: I deploy digital scouts that search LinkedIn, Google Maps, and forums for people who need your help — then send a friendly, personalized "first hello" automatically.
          </p>
        </div>
        <p className="text-sm font-display font-medium text-white/70 uppercase leading-relaxed tracking-wide border-l-4 border-[#CCFF00] pl-4">
          Stop cold calling. My Scout-Bots find your ideal customers while you sleep and fill your inbox with people saying "Tell me more."
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          {[
            { title: 'B2B SERVICES', desc: 'Finds CEOs who just hired. Sends personalized congrats + audit offer.' },
            { title: 'RESIDENTIAL', desc: 'Monitors home sales. Sends new homeowners a welcome offer.' },
            { title: 'SAAS & TECH', desc: 'Scans complaints about competitors. Offers your solution instantly.' },
            { title: 'EVENTS & VENUES', desc: 'Tracks engagement announcements. Sends VIP tour invitations.' },
          ].map(({ title, desc }) => (
            <div key={title} className="space-y-1">
              <span className="text-[8px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">{title}</span>
              <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">{desc}</p>
            </div>
          ))}
        </div>
        <div className="p-3 glass rounded-xl border-l-4 border-[#CCFF00]">
          <span className="text-[9px] font-display font-bold text-[#CCFF00] uppercase tracking-widest">ESTIMATED LIFT: 3-5 QUALIFIED LEADS PER WEEK</span>
        </div>
      </div>
    ),
    'workstation': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">NVIDIA WORKSTATION</h4>
        <div className="p-4 bg-[#CCFF00] text-black rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight">
            PLAIN ENGLISH: I own the heavy-duty computers that other agencies have to "rent" from the cloud. This means I can finish your work in minutes while they're still waiting for their files to upload or paying $10/hour just to turn the machine on.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Zap, label: 'GPU', value: 'RTX 4090 24GB' },
            { icon: Cpu, label: 'CPU', value: 'RYZEN 7800X3D' },
            { icon: Layers, label: 'RAM', value: '128GB DDR5 6000MHz' },
            { icon: HardDrive, label: 'STORAGE', value: 'WD BLACK 14GBPS NVMe' },
            { icon: Globe, label: 'NETWORK', value: '2GBPS FIBER OPTIC' },
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
        <p className="text-sm font-body font-medium text-gray-400 uppercase leading-relaxed tracking-wide">
          This machine handles 8K raw video and deep-learning training without breaking a sweat. It enables "Live Iteration" — making real-time changes during client calls instead of waiting hours for renders.
        </p>
        <div className="p-3 glass rounded-xl border-l-4 border-[#CCFF00]">
          <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">
            <span className="text-[#CCFF00]">BENEFIT:</span> A localized supercomputer eliminates cloud data latency, security risks, and massive overhead costs. Your project never leaves my secure environment.
          </p>
        </div>
      </div>
    ),
    'filmmaking': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">RED ECOSYSTEM: THE HOLLYWOOD STANDARD</h4>
        <div className="p-4 glass rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight text-white">
            PLAIN ENGLISH: I use the exact same camera brand that shot "The Social Network," "Avatar," and "Deadpool." Your business isn't "small time" — it's an epic story.
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
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          {[
            { title: 'MEDICAL CLINIC', subtitle: '"THE SURGICAL PRECISION LOOK"', desc: 'Every tool, smile, and procedure captured in 6K RAW. Removes the "scary" vibe — patients choose you because your visuals match your medicine quality.' },
            { title: 'TRADES / BUILDER', subtitle: '"THE CRAFTSMAN\'S SOUL"', desc: 'A custom build where wood, steel, and sweat look like art. You\'re not just "working on a house" — you\'re creating a legacy.' },
            { title: 'LEGAL & FINANCIAL', subtitle: '"THE VISUAL AUTHORITY"', desc: 'A cinematic brand story that humanizes the person behind the firm. High-end lighting + clear audio = you look trustworthy, sharp, and powerful.' },
            { title: 'RESTAURANT & HOSPITALITY', subtitle: '"THE CHEF\'S TABLE EXPERIENCE"', desc: 'Capture the steam, texture, and vibe. Make a burger look like a $100 plate. Turn your spot into a destination they have to visit.' },
          ].map(({ title, subtitle, desc }) => (
            <div key={title} className="space-y-1">
              <span className="text-[8px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">{title}</span>
              <span className="text-[8px] font-display font-bold text-white/50 uppercase block">{subtitle}</span>
              <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">{desc}</p>
            </div>
          ))}
        </div>
        <div className="p-3 glass rounded-xl border-l-4 border-[#CCFF00]">
          <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">
            <span className="text-[#CCFF00]">BENEFIT:</span> A cinematic mini-documentary humanizes your brand, builds instant subconscious trust, and signals elite leadership.
          </p>
        </div>
      </div>
    ),
    'optical-glass': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">SIRUI SATURN SERIES: THE ANAMORPHIC ADVANTAGE</h4>
        <div className="p-4 bg-[#CCFF00] text-black rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight">
            PLAIN ENGLISH: Regular lenses look like a "Zoom call." These lenses look like a "Netflix Movie." Our brains are hard-wired to respect the wide perspective and horizontal blue flares found in Hollywood's greatest films.
          </p>
        </div>
        <div className="p-4 glass rounded-xl border-l-4 border-[#CCFF00]">
          <span className="text-[9px] font-display font-bold text-white uppercase tracking-widest">
            HORIZONTAL STRETCH // OVAL BOKEH // CINEMATIC BLUE FLARES // 2.4:1 ASPECT RATIO
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="space-y-1">
            <span className="text-[8px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">PRESTIGE PSYCHOLOGY</span>
            <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">
              The distinct horizontal field of view signals "Hollywood" to the viewer's subconscious. They stop scrolling and take your message seriously.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">AUTHORITY FACTOR</span>
            <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">
              The wide frame shows you in your environment while focusing on your face — intimate yet grand. It humanizes you while making you look like a global leader. The difference between a "service provider" and an "authority."
            </p>
          </div>
        </div>
        <p className="text-sm font-body font-medium text-gray-400 uppercase leading-relaxed tracking-wide">
          70+ years of prestige films — from Lawrence of Arabia to The Dark Knight — use anamorphic glass. Audiences are naturally inclined to view anamorphic content as more expensive, professional, and trustworthy.
        </p>
      </div>
    ),
    'gimbal-lidar': (
      <div className="space-y-5">
        <h4 className="text-2xl lg:text-3xl font-display font-extrabold text-white uppercase tracking-tighter leading-none">DJI RS3 PRO & LIDAR FOCUS</h4>
        <div className="p-4 bg-[#CCFF00] text-black rounded-xl">
          <p className="text-[10px] font-body font-bold uppercase tracking-widest leading-tight">
            PLAIN ENGLISH: Handheld video often looks shaky and cheap. We use laser-guided robots to float our cameras through your space, ensuring every shot is smooth as silk and perfectly in focus, no matter how fast things move.
          </p>
        </div>
        <div className="p-4 glass rounded-xl border-l-4 border-[#CCFF00]">
          <span className="text-[9px] font-display font-bold text-white uppercase tracking-widest">
            DJI RS3 PRO // LIDAR FOCUS PRO // CARBON FIBER CONSTRUCTION // 43,200 SCANS/SEC
          </span>
        </div>
        <p className="text-sm font-body font-medium text-gray-400 uppercase leading-relaxed tracking-wide">
          Our LiDAR system maps the environment in 3D using invisible lasers, keeping subjects razor-sharp in low-light or high-speed conditions. We never miss "the moment."
        </p>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="space-y-1">
            <span className="text-[8px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">CINEMATIC STABILITY</span>
            <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">
              Smooth motion tells the brain: trust, reliability, world-class quality. Shaky footage tells the brain: amateur hour.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] font-body text-[#CCFF00] uppercase block font-bold tracking-widest">LASER-GUIDED PRECISION</span>
            <p className="text-[9px] text-gray-400 uppercase leading-tight font-bold">
              Never misses authentic high-speed moments. Surgical clarity gives you a massive visual storytelling advantage over competitors using autofocus.
            </p>
          </div>
        </div>
      </div>
    )
  };

  return content[categoryId] || <p className="text-gray-400">Content not found</p>;
};

export default ArmoryModule;
