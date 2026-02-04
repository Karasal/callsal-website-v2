import React, { useState, useRef } from 'react';
import { useMobileAnimations } from '../hooks/useMobileAnimations';
import { motion } from 'framer-motion';
import {
  ArrowRight, Zap, TrendingUp, Clock, Film, Quote, Handshake,
  Phone, Mail, MapPin
} from 'lucide-react';
import { ImageModal } from './ImageModal';

export const MeetSalman: React.FC<{ onNext: () => void; onConsultation: () => void }> = ({ onNext, onConsultation }) => {
  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(null);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const inviteRef = useRef<HTMLHeadingElement>(null);
  const grandExperimentRef = useRef<HTMLHeadingElement>(null);
  const { isMobile, getVariants } = useMobileAnimations();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };
  const mobileContainerVariants = getVariants(containerVariants);
  const mobileItemVariants = getVariants(itemVariants);

  return (
    <motion.div
      variants={mobileContainerVariants}
      initial={isMobile ? false : "hidden"}
      animate="visible"
      className="max-w-7xl mx-auto px-4 py-12 lg:py-0 space-y-32 overflow-visible"
    >
      {/* 1. HERO / INTRODUCTION */}
      <section className="min-h-[75vh] lg:min-h-0 lg:h-[calc(100dvh-144px)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-5">
          <motion.div variants={mobileItemVariants} className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-[#CCFF00]" />
              <span className="text-[10px] lg:text-[11px] font-body tracking-[0.5em] uppercase font-black gradient-text">THE HUMAN ELEMENT</span>
            </div>
            <h1 ref={heroRef} className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-black text-white uppercase tracking-tighter leading-[0.8]">
              <span className="text-[#CCFF00]" style={{ WebkitTextFillColor: '#CCFF00' }}>HEY</span><span> - I'M</span> <br /> <span className="text-[#CCFF00]" style={{ WebkitTextFillColor: '#CCFF00' }}>SALMAN</span><span>.</span>
            </h1>
          </motion.div>

          <motion.p variants={mobileItemVariants} className="text-lg lg:text-2xl font-display font-medium text-white/80 uppercase leading-tight tracking-tight border-l-4 border-[#CCFF00] pl-6">
            I LIKE <span className="text-[#CCFF00]">WONDERFUL</span> PEOPLE THAT DO <span className="text-[#CCFF00]">INCREDIBLE</span> THINGS. I WANT TO BE YOUR <span className="text-[#CCFF00]">BIGGEST FAN</span>, AND #1 SUPPORTER. BUT ALSO I LIVE IN <span className="text-[#CCFF00]">2026</span>. IT'S A LITTLE ROUGH OUT HERE RIGHT NOW - AND THE <span className="text-[#CCFF00]">BEST WAY</span> TO BE OF <span className="text-[#CCFF00]">SERVICE</span> IS TO HELP YOU GET <span className="text-[#CCFF00]">ULTRA-PRODUCTIVE</span>, <span className="text-[#CCFF00]">SAVE</span> A TON OF MONEY AND <span className="text-[#CCFF00]">MAKE</span> WHOLE LOT MORE. LET'S <span className="text-[#CCFF00]">WIN BACK YOUR TIME</span> SO YOU CAN <span className="text-[#CCFF00]">FOCUS</span> ON THE THINGS THAT <span className="text-[#CCFF00]">TRULY MATTER</span>.
            <span className="text-gray-400 block mt-4">"NOW THAT'S <span className="text-[#CCFF00]">THE KIND OF GUY</span> YOU WANT TO <span className="text-[#CCFF00]">HIRE!</span>"</span>
          </motion.p>

          <motion.div variants={mobileItemVariants} className="flex flex-wrap gap-4">
            <a href="tel:905-749-0266" className="px-5 py-3 glass rounded-xl flex items-center gap-2 hover:bg-black/[0.05] transition-colors">
               <Phone size={16} className="text-[#CCFF00]" />
               <span className="text-[9px] font-body font-black text-gray-400 uppercase tracking-widest">905-749-0266</span>
            </a>
            <a href="mailto:info@callsal.app" className="px-5 py-3 glass rounded-xl flex items-center gap-2 hover:bg-black/[0.05] transition-colors">
               <Mail size={16} className="text-[#CCFF00]" />
               <span className="text-[9px] font-body font-black text-gray-400 uppercase tracking-widest">INFO@CALLSAL.APP</span>
            </a>
            <a href="https://maps.google.com/?q=Calgary,AB,Canada" target="_blank" rel="noopener noreferrer" className="px-5 py-3 glass rounded-xl flex items-center gap-2 hover:bg-black/[0.05] transition-colors">
               <MapPin size={16} className="text-[#CCFF00]" />
               <span className="text-[9px] font-body font-black text-gray-400 uppercase tracking-widest">CALGARY, AB</span>
            </a>
          </motion.div>
        </div>

        <motion.div variants={mobileItemVariants} className="lg:col-span-5 relative group">
          <div className="glow-lime rounded-2xl">
            <div className="aspect-[4/5] glass rounded-2xl overflow-hidden relative">
               <img
                 src="https://i.ibb.co/m5YMYQR6/Generated-Image-January-12-2026-1-46-PM.jpg"
                 loading="lazy"
                 className="w-full h-full object-cover transition-all duration-1000"
                 alt="Salman Chowdhury - Founder"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
               <div className="absolute bottom-8 left-8 flex items-end gap-4">
                  <div className="w-6 h-12 border-l-2 border-b-2 border-[#CCFF00] pointer-events-none" />
                  <div>
                    <p className="text-[10px] font-body font-black text-[#CCFF00] uppercase tracking-widest mb-1">FOUNDER & CHIEF ARCHITECT</p>
                    <p className="text-2xl font-display font-black uppercase tracking-tighter gradient-text">SALMAN CHOWDHURY</p>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. THE JOURNEY / EVOLUTION */}
      <section className="relative overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <motion.div variants={mobileItemVariants} className="space-y-6">
              <h2 ref={grandExperimentRef} className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none"><span className="text-[1.2em]">THE</span> GRAND <br /><span className="text-[0.8em]">EXPERIMENT.</span></h2>
              <div className="w-24 h-1 bg-[#CCFF00]" />
            </motion.div>

            <motion.div variants={mobileItemVariants} className="space-y-8 text-gray-400 text-base lg:text-lg font-display font-medium uppercase leading-relaxed tracking-wide">
              <p>
                I HAVE CARRIED A <span className="text-white">LIFELONG PASSION</span> FOR FILMS AND THE RAW POWER OF STORYTELLING. MY CAREER AS A DIGITAL CONTENT PRODUCER AND MARKETER HAS LED ME TO A SINGULAR REALIZATION: THE WORLD HAS CHANGED, AND THE <span className="text-[#CCFF00]">OLD RULES</span> NO LONGER APPLY.
              </p>
              <p>
                I DISCOVERED THAT THE FUTURE OF SCALABLE SUCCESS LIES AT THE INTERSECTION OF <span className="text-[#CCFF00]">AUTHENTIC FILMMAKING</span>, AND <span className="text-[#CCFF00]">AGENTIC WORKFLOWS</span>. THESE AREN'T JUST TRENDS; THEY ARE THE ENGINES OF THE NEW ECONOMY.
              </p>
              <p>
                TODAY, I HELP ADVENTUROUS BUSINESS OWNERS <span className="text-white underline decoration-[#CCFF00] decoration-4 underline-offset-8">RAPIDLY TRANSFORM</span> THEIR COMPANIES INTO ELITE, AI-POWERED ORGANIZATIONS. WE ARE TURNING SLOW, TEDIOUS BUSYWORK INTO HIGH-SPEED, AUTOMATED WORKFLOWS THAT RUN WHILE YOU SLEEP.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: <Zap size={48} />, title: "ADAPT & ACCELERATE", desc: "IN 2026, AGILITY IS THE ONLY DEFENSE. I ARCHITECT SYSTEMS THAT ALLOW YOU TO ADAPT TO NEW REALITIES INSTANTLY AND ACCELERATE TOWARD TOTAL MARKET LEADERSHIP." },
              { icon: <TrendingUp size={48} />, title: "THE UNFAIR ADVANTAGE", desc: "LEVERAGE TOOLS THAT WORK WHILE YOU SLEEP. REDUCE OVERHEAD TO ZERO WHILE MULTIPLYING OUTPUT." },
              { icon: <Clock size={48} />, title: "TIME SOVEREIGNTY", desc: "WE WIN BACK THE HOURS YOU LOSE TO THE GRIND. FOCUS ON YOUR VISION, NOT THE SPREADSHEETS." },
              { icon: <Film size={48} />, title: "CINEMATIC TRUTH", desc: "DOCUMENTING THE LIFE AND LEGACY OF THOSE MAKING THE EXPERIMENT OF LIFE EXCITING." },
            ].map((card, i) => (
              <motion.div key={i} variants={mobileItemVariants} className="glass rounded-2xl p-8 flex flex-col justify-between group hover:bg-black/[0.05] transition-all duration-700 min-h-[280px]">
                <span className="text-[#CCFF00] mb-auto">{card.icon}</span>
                <div>
                  <h4 className="text-base lg:text-lg font-display font-black text-white uppercase leading-tight mb-4">{card.title}</h4>
                  <p className="text-[10px] font-body text-gray-400 uppercase font-black leading-tight">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PHILOSOPHY / THE "WHY" - Keep dark for contrast */}
      <section className="glass-strong rounded-2xl text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Quote size={400} />
        </div>
        <div className="p-12 lg:p-24 space-y-16 relative z-10">
          <motion.div variants={mobileItemVariants} className="max-w-4xl">
            <h2 className="text-5xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-[0.85] mb-12">
              EVERYTHING <br /> WE DO IS <br /> FOR <span className="bg-[#CCFF00] text-black px-4 rounded-lg">"US"</span>.
            </h2>
            <div className="space-y-8 text-lg lg:text-2xl font-body font-medium uppercase leading-relaxed">
              <p>
                WE ENTERTAIN, DELIGHT, AND SERVE ONE ANOTHER.<br />
                WE CARE FOR EACH OTHER. WE CO-OPERATE, AND WE COMPETE.<br />
                BUT THE CONSTANT IS <span className="border-b-4 border-[#CCFF00] font-bold">HUMANITY</span> — WE DO IT ALL FOR <span className="bg-[#CCFF00] text-black px-2 rounded-lg font-bold">"US"</span>.
              </p>
              <p className="text-gray-400 font-body font-medium normal-case text-base lg:text-xl leading-relaxed">
                Filmmaking is one of the last beautiful arts to preserve and document the life and legacy of the people who made this grand experiment of life just a little bit more exciting.
              </p>
            </div>
          </motion.div>

          <motion.div variants={mobileItemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-200 pt-16">
            <div className="space-y-4">
              <span className="text-[10px] font-body font-black uppercase tracking-[0.4em] text-[#CCFF00]">THE GOAL</span>
              <p className="text-sm font-body font-medium normal-case leading-relaxed text-white/80">Do well in this world, be of great value and service, and be tremendously rewarded.</p>
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-body font-black uppercase tracking-[0.4em] text-[#CCFF00]">THE REWARD</span>
              <p className="text-sm font-body font-medium normal-case leading-relaxed text-white/80">An exciting, fulfilling life of experiences, friendships, & meaning.</p>
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-body font-black uppercase tracking-[0.4em] text-[#CCFF00]">THE MISSION</span>
              <p className="text-sm font-body font-medium normal-case leading-relaxed text-white/80">Be the person people call when they "need something done right - now!"</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. THE PROMISE / CALL TO ACTION */}
      <section className="text-center space-y-16">
        <motion.div variants={mobileItemVariants} className="max-w-4xl mx-auto space-y-8">
          <span className="text-[11px] font-body tracking-[1em] text-[#CCFF00] uppercase font-black block">THE INVITATION</span>
          <h2 ref={inviteRef} className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none whitespace-nowrap">
            INVITE ME IN.
          </h2>
          <p className="text-lg lg:text-2xl font-display font-medium text-gray-400 uppercase leading-relaxed tracking-wide">
            I WANT TO BE <span className="text-[#CCFF00]">THE ONE TO HELP YOU</span> NAVIGATE THIS <span className="text-[#CCFF00]">NEW ERA</span> OF <span className="text-[#CCFF00]">AI</span> AND <span className="text-[#CCFF00]">CINEMATIC</span> BRANDING.
            I DON'T JUST WANT TO BE A VENDOR—I WANT TO BE <span className="text-[#CCFF00]">THE ONE WHO WATCHES YOU SCALE TO HEIGHTS</span> YOU PREVIOUSLY THOUGHT <span className="text-[#CCFF00]">IMPOSSIBLE</span>.
          </p>
        </motion.div>

        <motion.div variants={mobileItemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button
            onClick={onNext}
            className="btn-primary px-12 py-8 text-xs tracking-[0.4em] uppercase flex items-center gap-4"
          >
            THE OFFER <ArrowRight size={20} />
          </button>
          <button
            onClick={onConsultation}
            className="btn-glass px-12 py-8 text-xs tracking-[0.4em] uppercase flex items-center gap-4"
          >
            LET'S CHAT <Handshake size={20} />
          </button>
        </motion.div>

        {/* Closing Stat Grid */}
        <motion.div variants={mobileItemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-20 border-t border-gray-200">
           <div className="space-y-2">
              <p className="text-4xl lg:text-6xl font-display font-black" style={{ color: '#00F0FF' }}>12+</p>
              <p className="text-[9px] font-body text-gray-400 uppercase tracking-widest font-black">YEARS OF INNOVATION</p>
           </div>
           <div className="space-y-2">
              <p className="text-4xl lg:text-6xl font-display font-black" style={{ color: '#CCFF00' }}>200+</p>
              <p className="text-[9px] font-body text-gray-400 uppercase tracking-widest font-black">STORIES TOLD</p>
           </div>
           <div className="space-y-2">
              <p className="text-4xl lg:text-6xl font-display font-black" style={{ color: '#B400FF' }}>100%</p>
              <p className="text-[9px] font-body text-gray-400 uppercase tracking-widest font-black">HUMAN CENTERED</p>
           </div>
           <div className="space-y-2">
              <p className="text-4xl lg:text-6xl font-display font-black" style={{ color: '#FF5A00' }}>∞</p>
              <p className="text-[9px] font-body text-gray-400 uppercase tracking-widest font-black">POSSIBILITIES</p>
           </div>
        </motion.div>
      </section>

      <ImageModal src={selectedFullImage} onClose={() => setSelectedFullImage(null)} />
    </motion.div>
  );
};
