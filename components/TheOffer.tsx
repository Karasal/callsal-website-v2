import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useMobileAnimations } from '../hooks/useMobileAnimations';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, ArrowRight, Phone, ChevronRight, Gift, Heart,
  MapPin, Users, Sparkles, Film, Calendar, CheckCircle, Play, X,
  Mail
} from 'lucide-react';

const videoProjects = [
  { id: "RLwo8clXyZM", title: "THE SUPREME BARBERSHOP YYC", company: "KALEB BRUNNING", description: "Fast-paced, high-energy brand showcase for Calgary's premier grooming destination, focusing on precision, style, and the art of the cut." },
  { id: "gxeU_tq7jH8", title: "SURVIVING THE SILENCE", company: "PETER HERBIG", description: "A gripping cinematic exploration of resilience and the human spirit, captured with raw emotional intensity and high-end visual storytelling." },
  { id: "2D6Dc7Pa_1s", title: "NATEFIT", company: "NATHANIEL ERNST", description: "A dynamic fitness journey documentary highlighting the transformational power of dedicated coaching and the strength of the YYC community." },
  { id: "1a7M7Np5g10", title: "SPRING CLEANUP COMMERCIAL", company: "K&M LANDSCAPING", description: "Transforming outdoor spaces into living art. A visual seasonal journey showcasing the mastery and evolution of premium Calgary landscapes." },
  { id: "RLUiuSgi0zU", title: "MAD BUILDERS", company: "MAD HOUSE", description: "Behind the scenes of architectural mastery, capturing the grit, precision, and glory involved in crafting high-end custom residential builds." },
  { id: "Up0lNvLU230", title: "I AM MATHEW", company: "MAD HOUSE", description: "An intimate and evocative cinematic portrait exploring personal identity through the specialized lens of modern digital creativity." },
];

const VideoModal = ({ id, title, onClose, isMobile }: { id: string, title: string, onClose: () => void, isMobile: boolean }) => (
  <motion.div
    {...(isMobile ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } } : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } })}
    className="fixed inset-0 bg-black/98 z-[500] flex items-center justify-center p-4 lg:p-12 backdrop-blur-3xl"
    onClick={onClose}
  >
    <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white z-10">
      <X size={32} />
    </button>
    <div className="max-w-6xl w-full">
      <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <div className="mt-6">
        <h3 className="text-xl lg:text-2xl font-display font-black text-white uppercase tracking-tight">{title}</h3>
      </div>
    </div>
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export const TheOffer: React.FC<{ onConsultation: () => void }> = ({ onConsultation }) => {
  const [activeProject, setActiveProject] = useState(videoProjects[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isMobile, getVariants } = useMobileAnimations();

  const mobileContainerVariants = getVariants(containerVariants);
  const mobileItemVariants = getVariants(itemVariants);

  return (
    <motion.div
      variants={mobileContainerVariants}
      initial={isMobile ? false : "hidden"}
      animate="visible"
      className="max-w-7xl mx-auto px-4 py-12 lg:py-0 space-y-32"
    >
      {/* ========== SECTION 1: HERO ========== */}
      <section className="min-h-[75vh] lg:min-h-0 lg:h-[calc(100dvh-144px)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <motion.div variants={mobileItemVariants} className="space-y-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 sm:w-12 h-[1px] bg-[#CCFF00] shrink-0" />
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-body tracking-[0.2em] sm:tracking-[0.5em] uppercase font-black gradient-text">FOR CALGARY & SURROUNDING AREAS</span>
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-7xl xl:text-8xl font-display font-black text-white uppercase tracking-tighter leading-[0.85]">
              <span className="text-red-500" style={{ WebkitTextFillColor: '#CCFF00' }}>FREE</span><span> VIDEO.</span><br />
              <span>ZERO CATCH.</span>
            </h1>
          </motion.div>

          <motion.p variants={mobileItemVariants} className="text-base sm:text-lg lg:text-xl xl:text-2xl font-display font-medium text-gray-400 uppercase leading-tight tracking-tight border-l-4 border-[#CCFF00] pl-4 sm:pl-6 lg:pl-8">
            A <span className="text-red-500">NETFLIX</span>-QUALITY <span className="text-red-500">CINEMATIC</span> FOR YOUR <span className="text-red-500">BUSINESS</span>.<br />
            SHOT ON A <span className="text-red-500">RED KOMODO-X</span> CINEMA CAMERA.<br />
            <span className="text-red-500">EDITED</span>, COLOUR <span className="text-red-500">GRADED</span>, AND <span className="text-red-500">SOUNDTRACKED</span>.
            <span className="text-white font-black block mt-3 sm:mt-4">COMPLETELY FREE.</span>
          </motion.p>

          <motion.div variants={mobileItemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6">
            <button
              onClick={onConsultation}
              className="w-full sm:w-auto btn-primary px-6 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-5 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase flex items-center justify-center gap-3 sm:gap-4"
            >
              BOOK FREE CALL <ArrowRight size={18} />
            </button>
            <a
              href="tel:905-749-0266"
              className="w-full sm:w-auto btn-glass px-6 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-5 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase flex items-center justify-center gap-3 sm:gap-4"
            >
              <Phone size={18} /> CALL SAL
            </a>
          </motion.div>
        </div>

        <motion.div variants={mobileItemVariants} className="lg:col-span-5 relative group">
          <div className="glow-lime rounded-2xl">
            <div className="glass rounded-2xl p-1 overflow-hidden">
              <div
                className="relative aspect-[4/5] lg:aspect-[3/4] cursor-pointer overflow-hidden rounded-xl"
                onClick={() => setIsModalOpen(true)}
              >
                <img
                  src={`https://img.youtube.com/vi/${activeProject.id}/maxresdefault.jpg`}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt={activeProject.title}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-white/10 flex items-center justify-center rounded-full hover:bg-[#CCFF00] hover:border-[#CCFF00] transition-all">
                    <Play className="text-white ml-1" size={32} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <span className="text-[11px] sm:text-[9px] font-body text-red-500 uppercase font-black block mb-1">NOW PLAYING</span>
                  <h4 className="text-lg font-display font-black text-white uppercase tracking-tighter">{activeProject.title}</h4>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========== SECTION 2: THE STORY ========== */}
      <section className="glass-strong rounded-2xl overflow-hidden relative">
        <div className="p-6 sm:p-10 lg:p-20 space-y-8 sm:space-y-12 relative z-10">
          <motion.div variants={mobileItemVariants} className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <Heart size={24} className="text-white" />
              <span className="text-xs sm:text-[10px] font-body font-black uppercase tracking-[0.4em] text-gray-400">A QUICK WORD FROM SAL</span>
            </div>
            <h2 className="inline-block text-2xl sm:text-4xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-[1] mb-6 sm:mb-10">
              "IF YOU'RE GOING TO INVITE YOURSELF OVER —<br /><span className="bg-black text-white px-2 sm:px-3 py-1 inline-block mt-2 rounded-lg">COME BEARING GIFTS.</span>"
            </h2>
          </motion.div>

          <motion.div variants={mobileItemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-8 text-base lg:text-lg font-display font-medium uppercase leading-relaxed tracking-wide text-gray-400">
              <p>
                HEY, I'M <span className="text-red-500">SAL</span>. MY WIFE AND I JUST MOVED OUR <span className="text-red-500">YOUNG FAMILY OF FIVE</span> FROM ONTARIO TO <span className="text-red-500">CALGARY</span>.
                THREE KIDS UNDER SIX, A <span className="text-red-500">DREAM</span> OF BUILDING SOMETHING <span className="text-red-500">MEANINGFUL</span>, AND <span className="text-red-500">ZERO CONNECTIONS</span> IN THIS CITY.
              </p>
              <p>
                BACK IN ONTARIO, I SPENT YEARS HELPING <span className="text-red-500">SMALL BUSINESSES</span> WITH THEIR <span className="text-red-500">DIGITAL MARKETING</span>.
                THEIR BIGGEST <span className="text-red-500">STRUGGLE</span> WAS ALWAYS THE <span className="text-red-500">BUDGET</span> - BUT WE <span className="text-red-500">MADE IT WORK</span>!
              </p>
              <p className="text-white font-black">
                THEN <span className="text-red-500">AI</span> HAPPENED.
              </p>
            </div>
            <div className="space-y-8 text-base lg:text-lg font-display font-medium uppercase leading-relaxed tracking-wide text-gray-400">
              <p>
                <span className="text-red-500">I REALIZED</span>: IF I <span className="text-red-500">COMBINE</span> WHAT I KNOW ABOUT <span className="text-red-500">MARKETING</span> WITH WHAT <span className="text-red-500">AI</span> CAN DO,
                I CAN HELP <span className="text-red-500">BUSINESS OWNERS</span> IN WAYS THAT <span className="text-red-500">USED TO COST A FORTUNE</span>.
              </p>
              <p>
                SO INSTEAD OF <span className="text-red-500">COLD CALLING</span>, I WANT TO MAKE YOU <span className="text-red-500">AN OFFER</span>.
                GIVE ME <span className="text-red-500">30 MINUTES</span> OF YOUR <span className="text-red-500">TIME</span> TO <span className="text-red-500">SHOW YOU WHAT'S POSSIBLE</span>.
                AND TO <span className="text-red-500">THANK YOU</span>, I'LL CREATE A <span className="text-red-500">FREE</span> <span className="text-red-500">CINEMATIC VIDEO</span> FOR YOUR <span className="text-red-500">BUSINESS</span>.
              </p>
              <p className="text-white font-black border-b-4 border-white inline-block">
                MY HOPE? THAT YOU'LL BE <span className="text-red-500">IMPRESSED</span> ENOUGH TO <span className="text-red-500">WORK WITH ME</span> — OR <span className="text-red-500">TELL YOUR FRIENDS</span> TO "<span className="text-red-500">CALL SAL</span>".
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== SECTION 3: WHAT YOU GET ========== */}
      <section className="space-y-12">
        <motion.div variants={mobileItemVariants} className="text-center space-y-6">
          <span className="text-xs sm:text-[10px] font-body tracking-[0.5em] text-red-500 uppercase font-black block">THE DEAL</span>
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-display font-black text-white uppercase tracking-tighter leading-none">
            WHAT YOU GET.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* The Meeting */}
          <motion.div variants={mobileItemVariants} className="glass rounded-2xl p-6 sm:p-10 lg:p-16 group hover:bg-black/[0.05] transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 glass rounded-xl flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <span className="text-xs sm:text-[10px] font-body font-black tracking-[0.3em] text-red-500 uppercase">PART 1: THE MEETING</span>
            </div>
            <h3 className="text-2xl lg:text-4xl font-display font-black text-white uppercase tracking-tighter mb-8 leading-none">
              30 MINUTES<br />WITH ME.
            </h3>
            <div className="space-y-4">
              {[
                "YOU TELL ME ABOUT YOUR BUSINESS AND YOUR BIGGEST HEADACHES",
                "I SHOW YOU HOW AI CAN HELP WITH YOUR SPECIFIC SITUATION",
                "WE TALK AUTOMATION, CONTENT, LEADS — WHATEVER MATTERS TO YOU",
                "I GIVE YOU HONEST ADVICE WHETHER WE WORK TOGETHER OR NOT",
                "NO SALES PITCH. NO PRESSURE. JUST A REAL CONVERSATION."
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 glass rounded-xl">
                  <CheckCircle size={16} className="text-red-500 mt-1 shrink-0" />
                  <span className="text-gray-400 text-xs font-display font-bold uppercase leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* The Video */}
          <motion.div variants={mobileItemVariants} className="glass rounded-2xl p-6 sm:p-10 lg:p-16 border-[#CCFF00]/30 bg-[#CCFF00]/5 group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-[#CCFF00] rounded-xl flex items-center justify-center">
                <Gift size={24} className="text-white" />
              </div>
              <span className="text-xs sm:text-[10px] font-body font-black tracking-[0.3em] text-red-500 uppercase">PART 2: YOUR FREE GIFT</span>
            </div>
            <h3 className="text-2xl lg:text-4xl font-display font-black text-white uppercase tracking-tighter mb-8 leading-none">
              A CINEMATIC<br />FOR YOUR BUSINESS.
            </h3>
            <div className="space-y-4">
              {[
                "A TALKING-HEAD INTERVIEW WITH YOU TELLING YOUR STORY",
                "B-ROLL FOOTAGE OF YOUR BUSINESS IN ACTION",
                "PROFESSIONAL EDITING THAT MAKES YOU LOOK INCREDIBLE",
                "COLOR GRADING THAT POPS ON ANY SCREEN",
                "SOUNDTRACK THAT CREATES EMOTION AND ENERGY",
                "CALL-TO-ACTION TAILORED TO YOUR BUSINESS GOALS"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-black/20 border border-[#CCFF00]/10 rounded-xl">
                  <CheckCircle size={16} className="text-red-500 mt-1 shrink-0" />
                  <span className="text-gray-400 text-xs font-display font-bold uppercase leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== SECTION 5: THE CAMERA ========== */}
      <section className="glass rounded-2xl p-6 sm:p-10 lg:p-20 bg-[#CCFF00] text-black border border-[#CCFF00]/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Camera size={28} />
              <span className="text-xs sm:text-[10px] font-body font-black uppercase tracking-[0.4em]">SHOT ON RED KOMODO-X</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-[0.85]">
              THIS ISN'T<br />iPHONE<br />FOOTAGE.
            </h2>
            <div className="space-y-6 text-base lg:text-lg font-display font-medium uppercase leading-relaxed tracking-wide text-black/60">
              <p>
                THE <span className="text-red-500">RED KOMODO-X</span> IS A CINEMA CAMERA MADE IN CALIFORNIA. IT'S THE SAME SENSOR TECHNOLOGY USED IN
                HOLLYWOOD PRODUCTIONS. MARVEL MOVIES. NETFLIX SHOWS.
              </p>
              <p>
                WHEN YOUR COMPETITORS ARE POSTING SHAKY PHONE VIDEOS, YOU'LL HAVE CONTENT THAT LOOKS
                LIKE IT CAME FROM A PRODUCTION STUDIO.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: "CAMERA", value: "RED KOMODO-X 6K" },
              { label: "EDITING SOFTWARE", value: "DAVINCI RESOLVE" },
              { label: "SAME TOOLS AS", value: "NETFLIX & MARVEL" }
            ].map((item, i) => (
              <div key={i} className="bg-black text-white p-4 sm:p-6 lg:p-8 rounded-xl">
                <span className="text-[9px] sm:text-[10px] font-body text-gray-400 uppercase tracking-widest block mb-2 font-black">
                  {item.label}
                </span>
                <p className="text-lg sm:text-xl lg:text-3xl font-display font-black uppercase tracking-tighter">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 6: THE NUMBERS ========== */}
      <section className="space-y-12">
        <motion.div variants={mobileItemVariants} className="text-center">
          <span className="text-xs sm:text-[10px] font-body tracking-[0.5em] text-red-500 uppercase font-black block mb-6">THE NUMBERS</span>
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-display font-black text-white uppercase tracking-tighter leading-none">
            SIMPLE MATH.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
          {[
            { number: "30", label: "MINUTE CALL", sub: "THAT'S IT", color: "#00F0FF" },
            { number: "3", label: "HOURS TO FILM", sub: "AT YOUR LOCATION", color: "#CCFF00" },
            { number: "72", label: "HOUR DELIVERY", sub: "FAST TURNAROUND", color: "#B400FF" },
            { number: "$0", label: "COST TO YOU", sub: "COMPLETELY FREE", color: "#FF5A00" }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={mobileItemVariants}
              className="glass rounded-2xl p-4 sm:p-8 lg:p-12 text-center group hover:bg-black/[0.05] transition-all"
            >
              <span style={{ color: item.color }} className="text-3xl sm:text-4xl lg:text-7xl font-display font-black block mb-2 sm:mb-4">
                {item.number}
              </span>
              <span className="text-[10px] sm:text-xs lg:text-sm font-display font-black text-white uppercase tracking-tight block mb-1 sm:mb-2">
                {item.label}
              </span>
              <span className="text-[8px] sm:text-[9px] font-body text-gray-400 uppercase tracking-wider sm:tracking-widest font-black">
                {item.sub}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== SECTION 7: HOW IT WORKS ========== */}
      <section className="space-y-12">
        <motion.div variants={mobileItemVariants} className="flex items-center gap-4">
          <div className="w-12 h-[1px] bg-[#CCFF00]" />
          <span className="text-xs sm:text-[10px] font-body tracking-[0.5em] text-red-500 uppercase font-black">THE PROCESS</span>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </motion.div>

        <h2 className="text-4xl sm:text-6xl lg:text-8xl font-display font-black text-white uppercase tracking-tighter leading-none">
          HOW IT WORKS.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {[
            { step: "01", title: "BOOK A 30-MINUTE CALL", desc: "PICK A TIME THAT WORKS FOR YOU. ZOOM, PHONE, OR IN PERSON IF YOU'RE IN CALGARY. I JUST WANT TO LEARN ABOUT YOUR BUSINESS.", icon: <Calendar size={20} /> },
            { step: "02", title: "WE HAVE A REAL CONVERSATION", desc: "TELL ME WHAT'S WORKING, WHAT'S NOT, AND WHERE YOU WANT TO BE. I'LL SHOW YOU WHAT AI CAN DO FOR YOUR SPECIFIC SITUATION.", icon: <Users size={20} /> },
            { step: "03", title: "WE SCHEDULE THE SHOOT", desc: "IF YOU WANT THE FREE VIDEO (WHY WOULDN'T YOU?), WE PICK A DAY THAT WORKS. I COME TO YOUR LOCATION WITH MY GEAR. ABOUT 3 HOURS.", icon: <Film size={20} /> },
            { step: "04", title: "YOU GET YOUR VIDEO IN 72 HOURS", desc: "I EDIT OVERNIGHT. COLOR GRADE. ADD MUSIC. POLISH IT UNTIL IT SHINES. THEN I SEND YOU THE FINISHED VIDEO. YOURS TO KEEP. FOREVER.", icon: <Sparkles size={20} /> }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={mobileItemVariants}
              className="glass rounded-2xl p-5 sm:p-8 lg:p-10 flex items-start gap-4 sm:gap-6 lg:gap-8 group hover:bg-black/[0.05] transition-all"
            >
              <div className="flex flex-col items-center gap-3 sm:gap-4 shrink-0">
                <span className="text-3xl sm:text-4xl lg:text-6xl font-display font-black text-red-500">
                  {item.step}
                </span>
                <div className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-xl flex items-center justify-center text-gray-400">
                  {item.icon}
                </div>
              </div>
              <div className="min-w-0">
                <h4 className="text-base sm:text-lg lg:text-2xl font-display font-black text-white uppercase tracking-tighter mb-2 sm:mb-4 leading-tight">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-[11px] sm:text-xs lg:text-sm font-display font-medium uppercase leading-relaxed tracking-wide">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== SECTION 8: WHO IT'S FOR ========== */}
      <section className="glass rounded-2xl p-5 sm:p-10 lg:p-16">
        <motion.div variants={mobileItemVariants} className="space-y-10">
          <div className="space-y-4">
            <span className="text-xs sm:text-[10px] font-body tracking-[0.5em] text-red-500 uppercase font-black block">THE FIT</span>
            <h3 className="text-3xl lg:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">
              THIS IS PERFECT<br />FOR YOU IF...
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "YOU'RE A BARBER, STYLIST, OR SALON OWNER WHO WANTS TO SHOW OFF YOUR WORK",
              "YOU'RE A PERSONAL TRAINER OR FITNESS COACH BUILDING YOUR BRAND",
              "YOU'RE A TRADESPERSON (CONTRACTOR, LANDSCAPER, PLUMBER) WHO NEEDS VISUALS",
              "YOU'RE AN ARTIST, CRAFTSPERSON, OR MAKER WHO CREATES BEAUTIFUL THINGS",
              "YOU RUN A LOCAL BUSINESS AND KNOW YOU SHOULD BE POSTING MORE CONTENT",
              "YOU'RE CURIOUS ABOUT AI BUT DON'T KNOW WHERE TO START",
              "YOU WANT TO LOOK MORE PROFESSIONAL THAN YOUR COMPETITORS",
              "YOU'RE TIRED OF POSTING BLURRY PHONE VIDEOS THAT GET NO ENGAGEMENT"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 glass rounded-xl transition-all">
                <ChevronRight size={16} className="text-red-500 mt-1 shrink-0" />
                <p className="text-gray-400 text-xs font-display font-bold uppercase leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ========== SECTION 9: FAQ ========== */}
      <section className="space-y-12">
        <motion.div variants={mobileItemVariants} className="text-center space-y-4">
          <span className="text-xs sm:text-[10px] font-body tracking-[0.5em] text-red-500 uppercase font-black block">QUESTIONS</span>
          <h2 className="text-3xl lg:text-6xl font-display font-black text-white uppercase tracking-tighter">
            YOU MIGHT BE WONDERING...
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { q: "WHAT'S THE CATCH?", a: "THERE ISN'T ONE. MY BUSINESS MODEL IS SIMPLE: I GIVE YOU SOMETHING VALUABLE FOR FREE, YOU'RE IMPRESSED, AND YOU EITHER HIRE ME OR TELL YOUR FRIENDS ABOUT ME." },
            { q: "WHY ARE YOU DOING THIS FOR FREE?", a: "BECAUSE I'M NEW IN CALGARY AND NEED TO BUILD RELATIONSHIPS. I'D RATHER SHOW YOU WHAT I CAN DO AND LET YOU DECIDE IF YOU WANT MORE." },
            { q: "DO I HAVE TO BUY ANYTHING AFTER?", a: "NOPE. THE VIDEO IS YOURS WHETHER WE WORK TOGETHER OR NOT. IF YOU LOVE WHAT I DO AND WANT MORE, GREAT. IF NOT, NO HARD FEELINGS." },
            { q: "WHAT IF I'M NOT READY FOR THE VIDEO YET?", a: "THAT'S TOTALLY FINE. BOOK THE CALL ANYWAY. WE'LL TALK ABOUT YOUR BUSINESS, I'LL GIVE YOU SOME IDEAS, AND THE VIDEO OFFER STANDS WHEN YOU'RE READY." },
            { q: "I'M NOT IN CALGARY. CAN YOU STILL HELP?", a: "FOR THE VIDEO, I NEED TO BE THERE IN PERSON. BUT FOR AI CONSULTING? WE CAN ABSOLUTELY DO THAT OVER ZOOM. AND IF YOU'RE EVER IN CALGARY, THE VIDEO OFFER STILL STANDS." },
            { q: "HOW LONG IS THE FINISHED VIDEO?", a: "USUALLY 60-90 SECONDS — PERFECT FOR INSTAGRAM, TIKTOK, LINKEDIN, OR YOUR WEBSITE. LONG ENOUGH TO TELL YOUR STORY, SHORT ENOUGH TO HOLD ATTENTION." }
          ].map((item, i) => (
            <motion.div key={i} variants={mobileItemVariants} className="glass rounded-2xl p-5 sm:p-8 lg:p-10 group hover:bg-black/[0.05] transition-all">
              <h4 className="text-sm sm:text-base lg:text-xl font-display font-black text-white uppercase tracking-tight mb-3 sm:mb-4">
                {item.q}
              </h4>
              <p className="text-gray-400 text-[11px] sm:text-xs lg:text-sm font-display font-medium uppercase leading-relaxed tracking-wide">
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== SECTION 10: FINAL CTA ========== */}
      <section className="glass-strong rounded-2xl p-6 sm:p-10 lg:p-20 text-center">
        <motion.div variants={mobileItemVariants} className="space-y-6 sm:space-y-10">
          <div className="flex items-center justify-center gap-4">
            <MapPin size={20} />
            <span className="text-xs sm:text-[10px] font-body font-black uppercase tracking-[0.4em]">CALGARY, ALBERTA</span>
          </div>

          <h3 className="text-2xl sm:text-4xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-[0.85]">
            LET'S MEET.<br />
            LET'S TALK.<br />
            LET'S MAKE<br />
            <span className="bg-black text-white px-2 sm:px-4 inline-block mt-2 rounded-lg">SOMETHING GREAT.</span>
          </h3>

          <p className="text-base lg:text-xl font-display font-medium text-gray-400 uppercase leading-relaxed tracking-wide max-w-2xl mx-auto">
            30 MINUTES OF YOUR TIME. A FREE NETFLIX-QUALITY VIDEO. ZERO OBLIGATION.
            THE WORST THAT HAPPENS IS YOU GET A FREE VIDEO AND SOME GOOD IDEAS.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 max-w-2xl mx-auto">
            <button
              onClick={onConsultation}
              className="w-full sm:flex-1 px-6 py-5 sm:px-8 sm:py-6 lg:py-8 bg-black text-white rounded-xl font-display font-black text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:scale-[1.02] transition-all flex items-center justify-center gap-3 sm:gap-4"
            >
              BOOK FREE CALL <ArrowRight size={18} />
            </button>
            <a
              href="tel:905-749-0266"
              className="w-full sm:flex-1 px-6 py-5 sm:px-8 sm:py-6 lg:py-8 border-2 border-white text-white rounded-xl font-display font-black text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 sm:gap-4"
            >
              <Phone size={18} /> CALL SAL NOW
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 sm:gap-3">
              <Mail size={14} className="text-gray-400" />
              <span className="text-[9px] sm:text-[10px] font-body font-black text-gray-400 uppercase tracking-wider sm:tracking-widest">INFO@CALLSAL.APP</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Phone size={14} className="text-gray-400" />
              <span className="text-[9px] sm:text-[10px] font-body font-black text-gray-400 uppercase tracking-wider sm:tracking-widest">905-749-0266</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========== CINEMATICS VIDEO PORTFOLIO ========== */}
      <section className="space-y-8">
        <motion.div variants={mobileItemVariants} className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-[#CCFF00]" />
            <span className="text-xs sm:text-[10px] font-body tracking-[0.5em] text-red-500 uppercase font-black">RECENT WORKS</span>
            <div className="w-12 h-[1px] bg-[#CCFF00]" />
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter">CINEMATICS.</h2>
        </motion.div>

        <div id="offer-video-player" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 scroll-mt-20">
          {/* Main Video Player */}
          <div className="lg:col-span-8">
            <div
              className="relative group cursor-pointer aspect-video overflow-hidden glass rounded-2xl"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={`https://img.youtube.com/vi/${activeProject.id}/maxresdefault.jpg`}
                className="w-full h-full object-cover transition-all duration-700"
                alt={activeProject.title}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 lg:w-28 lg:h-28 border-2 border-white/10 flex items-center justify-center rounded-full hover:bg-[#CCFF00] hover:border-[#CCFF00] transition-all">
                  <Play className="text-white ml-1" size={40} />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-all">
                <div>
                  <span className="text-[11px] sm:text-[9px] font-body text-red-500 uppercase font-black block mb-1">PROJECT_VIEW</span>
                  <h4 className="text-2xl font-display font-black text-white uppercase tracking-tighter">{activeProject.title}</h4>
                </div>
                <span className="text-[11px] sm:text-[9px] font-body text-gray-400 uppercase tracking-widest">{activeProject.company}</span>
              </div>
            </div>

            {/* Case Study Panel */}
            <motion.div
              key={activeProject.id}
              {...(isMobile ? { initial: false } : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } })}
              className="mt-8 glass rounded-2xl p-10 lg:p-12 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse" />
                  <span className="text-[11px] sm:text-[9px] font-body tracking-[0.3em] text-red-500 uppercase font-black">CASE STUDY</span>
                </div>
                <h4 className="text-2xl lg:text-4xl font-display font-black text-white uppercase tracking-tighter mb-4 leading-none">{activeProject.title}</h4>
                <p className="text-sm lg:text-base font-display font-medium text-gray-400 uppercase leading-relaxed tracking-wide">
                  {activeProject.description}
                </p>
                <div className="mt-8">
                  <span className="inline-block px-3 sm:px-4 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-lg text-[9px] sm:text-[10px] font-body text-red-500 uppercase tracking-wider sm:tracking-widest font-black">
                    PROJECT FOR: {activeProject.company}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Project List */}
          <div className="lg:col-span-4 flex flex-col gap-2 sm:gap-3">
            <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto no-scrollbar max-h-[300px] sm:max-h-[400px] lg:max-h-none">
              {videoProjects.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProject(p);
                    if (window.innerWidth < 1024) {
                      setTimeout(() => {
                        document.getElementById('offer-video-player')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }
                  }}
                  className={`w-full p-4 sm:p-5 lg:p-6 text-left rounded-xl border transition-all flex items-center justify-between group ${
                    activeProject.id === p.id
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'glass border-white/10 text-white hover:border-gray-400'
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`text-[8px] sm:text-[9px] font-body font-black uppercase mb-1 ${activeProject.id === p.id ? 'text-gray-400' : 'text-gray-400'}`}>{p.company}</p>
                    <p className="font-display font-black uppercase text-[11px] sm:text-xs lg:text-sm truncate">{p.title}</p>
                  </div>
                  <ChevronRight size={14} className={`shrink-0 transition-transform ${activeProject.id === p.id ? 'translate-x-1' : ''}`} />
                </button>
              ))}
            </div>
            <button
              onClick={onConsultation}
              className="w-full py-5 sm:py-6 lg:py-8 btn-primary text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-2 sm:mt-4"
            >
              BOOK FREE VIDEO
            </button>
          </div>
        </div>
      </section>

      {/* Video Modal — portal to body to escape transform: scale() in Module3DOverlay */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <VideoModal
              id={activeProject.id}
              title={activeProject.title}
              onClose={() => setIsModalOpen(false)}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ========== FOOTER QUOTE ========== */}
      <motion.div variants={mobileItemVariants} className="text-center pt-8">
        <p className="text-gray-300 text-xs font-body uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
          "I MOVED MY FAMILY ACROSS THE COUNTRY TO BUILD SOMETHING MEANINGFUL.
          I'M BETTING ON MYSELF, AND I'M BETTING THAT IF I HELP ENOUGH PEOPLE,
          GOOD THINGS WILL HAPPEN." — SAL
        </p>
      </motion.div>
    </motion.div>
  );
};
