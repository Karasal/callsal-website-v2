import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, MapPin, Phone, ChevronLeft, ChevronRight, Check, Loader2, User, Mail, Building, MessageSquare } from 'lucide-react';

type MeetingType = 'zoom' | 'in-person' | 'phone';

interface TimeSlot {
  time: string;
  display: string;
  available: boolean;
}

interface BookedSlot {
  start: string;
  end: string;
}

const MEETING_TYPES = [
  { id: 'zoom' as MeetingType, icon: Video, label: 'ZOOM CALL', desc: 'Video conference from anywhere' },
  { id: 'in-person' as MeetingType, icon: MapPin, label: 'IN-PERSON', desc: 'Meet at your place of business' },
  { id: 'phone' as MeetingType, icon: Phone, label: 'PHONE CALL', desc: 'Quick and convenient' },
];

const TIME_SLOTS_IN_PERSON = [
  { time: '16:00', display: '4:00 PM' },
  { time: '17:00', display: '5:00 PM' },
  { time: '18:00', display: '6:00 PM' },
  { time: '19:00', display: '7:00 PM' },
  { time: '20:00', display: '8:00 PM' },
  { time: '21:00', display: '9:00 PM' },
];

const TIME_SLOTS_REMOTE = [
  { time: '08:00', display: '8:00 AM' },
  { time: '09:00', display: '9:00 AM' },
  { time: '13:00', display: '1:00 PM' },
  { time: '16:00', display: '4:00 PM' },
  { time: '17:00', display: '5:00 PM' },
  { time: '18:00', display: '6:00 PM' },
  { time: '19:00', display: '7:00 PM' },
  { time: '20:00', display: '8:00 PM' },
  { time: '21:00', display: '9:00 PM' },
];

const getTimeSlotsForType = (type: MeetingType | null) => {
  return type === 'in-person' ? TIME_SLOTS_IN_PERSON : TIME_SLOTS_REMOTE;
};

export const BookingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [meetingType, setMeetingType] = useState<MeetingType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', business: '', location: '', notes: '',
  });

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 2);
    return date;
  }).filter(d => d.getDay() !== 0 && d.getDay() !== 6);

  useEffect(() => { fetchAvailability(); }, []);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings/availability');
      const data = await res.json();
      if (data.success) setBookedSlots(data.bookedSlots || []);
    } catch (err) { console.error('Failed to fetch availability:', err); }
    setLoading(false);
  };

  const isSlotBooked = (date: Date, time: string): boolean => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const slotKey = `${dateStr}T${time}`;
    const slotHour = parseInt(time.split(':')[0]);
    const prevHour = String(slotHour - 1).padStart(2, '0') + ':00';
    const prevSlotKey = `${dateStr}T${prevHour}`;
    return bookedSlots.some(booked => {
      const bookedKey = booked.start.substring(0, 16);
      return slotKey === bookedKey || prevSlotKey === bookedKey;
    });
  };

  const getAvailableSlots = (date: Date): TimeSlot[] => {
    const slots = getTimeSlotsForType(meetingType);
    return slots.map(slot => ({ ...slot, available: !isSlotBooked(date, slot.time) }));
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !meetingType) return;
    setSubmitting(true);
    setError('');
    try {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking',
          data: {
            name: formData.name, email: formData.email, phone: formData.phone,
            date: dateStr, time: selectedTime, meetingType: meetingType,
            notes: `Business: ${formData.business || 'Not provided'}${meetingType === 'in-person' ? `\nLocation: ${formData.location}` : ''}${formData.notes ? `\nNotes: ${formData.notes}` : ''}`,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => { document.getElementById('main-content')?.scrollTo(0, 0); }, 50);
      } else { setError(data.error || 'Failed to book meeting'); }
    } catch (err) { setError('Something went wrong. Please try again.'); }
    setSubmitting(false);
  };

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  if (success) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:py-12 relative z-10 bg-black -mx-4 sm:-mx-6 lg:-mx-12 -mt-24 lg:-mt-28 px-4 sm:px-6 lg:px-12 pt-24 lg:pt-28 min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-2xl border-[#CCFF00]/30 p-6 sm:p-12 lg:p-16 text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#CCFF00] rounded-xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <Check size={32} className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display font-black text-white uppercase tracking-tighter mb-4 sm:mb-6">
            YOU'RE BOOKED!
          </h2>
          <p className="text-base sm:text-lg font-display font-bold text-gray-400 uppercase tracking-wide mb-3 sm:mb-4">
            {formatDate(selectedDate!)} at {getTimeSlotsForType(meetingType).find(s => s.time === selectedTime)?.display}
          </p>
          <p className="text-xs sm:text-sm font-display text-gray-400 uppercase tracking-wider">
            Check your email for confirmation details.
          </p>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full bg-transparent border-2 border-white/20 rounded-xl p-4 sm:p-5 pl-10 sm:pl-14 focus:border-[#CCFF00] outline-none font-display font-bold uppercase text-xs sm:text-sm tracking-wide text-white placeholder:text-gray-400";

  return (
    <div className="space-y-16 lg:space-y-0 relative z-10 bg-black -mx-4 sm:-mx-6 lg:-mx-12 -mt-24 lg:-mt-28 px-4 sm:px-6 lg:px-12 pt-24 lg:pt-28 min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[85vh] lg:min-h-0 lg:h-[calc(100dvh-144px)] max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 sm:w-12 h-[1px] bg-[#CCFF00] shrink-0" />
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-body tracking-[0.2em] sm:tracking-[0.5em] uppercase font-black gradient-text">
                FREE 30-MINUTE STRATEGY SESSION
              </span>
            </div>
            <h1 ref={headingRef} className="text-5xl sm:text-7xl lg:text-7xl xl:text-8xl font-display font-black uppercase tracking-tighter leading-[0.85]">
              <span className="text-white">BOOK A</span><br />
              <span className="text-white">MEETING.</span><br />
              <span className="text-[#CCFF00]">GET A</span><br />
              <span className="text-[#CCFF00]">FREE VIDEO!</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-display font-medium text-white/80 uppercase leading-tight tracking-tight border-l-4 border-[#CCFF00] pl-4 sm:pl-6 lg:pl-8">
            LET'S <span className="text-[#CCFF00]">TALK</span> ABOUT YOUR <span className="text-[#CCFF00]">BUSINESS</span>.<br />
            NO <span className="text-[#CCFF00]">SALES PITCH</span>, NO <span className="text-[#CCFF00]">PRESSURE</span>.<br />
            JUST A <span className="text-[#CCFF00]">REAL CONVERSATION</span> ABOUT HOW<br />
            <span className="text-[#CCFF00]">AI</span> AND <span className="text-[#CCFF00]">VIDEO</span> CAN <span className="text-[#CCFF00]">TRANSFORM YOUR OPERATIONS</span>.
          </p>
        </div>

        <div className="lg:col-span-5 relative pr-3 pb-3 flex justify-end">
          <div className="glow-lime rounded-2xl max-w-[90%]">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden glass rounded-2xl">
              <img src="/booking-hero.png" alt="Professional video production" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2 sm:gap-4">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-display font-black text-xs sm:text-sm transition-all ${
                step >= s ? 'bg-[#CCFF00] text-black' : 'glass text-gray-400'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-6 sm:w-12 h-0.5 rounded-full ${step > s ? 'bg-[#CCFF00]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Booking Panel */}
        <div className="glass-strong rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Meeting Type */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5 sm:p-8 lg:p-12">
                <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight mb-2">HOW WOULD YOU LIKE TO MEET?</h3>
                <p className="text-xs sm:text-sm font-display text-gray-400 uppercase tracking-wide mb-6 sm:mb-8">SELECT YOUR PREFERRED FORMAT</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {MEETING_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => { setMeetingType(type.id); setStep(2); }}
                      className={`p-5 sm:p-8 rounded-xl border-2 text-left transition-all group ${
                        meetingType === type.id ? 'border-[#CCFF00] bg-[#CCFF00]/10' : 'border-white/20 hover:border-gray-300'
                      }`}
                    >
                      <type.icon size={28} className={`mb-3 sm:mb-4 transition-colors ${meetingType === type.id ? 'text-[#CCFF00]' : 'text-gray-400'}`} />
                      <h4 className="text-base sm:text-lg font-display font-black text-white uppercase tracking-tight mb-1 sm:mb-2">{type.label}</h4>
                      <p className="text-[10px] sm:text-xs font-display text-gray-400 uppercase tracking-wide">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Date Selection */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5 sm:p-8 lg:p-12">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-400 hover:text-white text-[10px] sm:text-xs font-display font-black uppercase tracking-widest mb-4 sm:mb-6 transition-colors">
                  <ChevronLeft size={14} /> BACK
                </button>
                <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight mb-2">PICK A DATE</h3>
                <p className="text-xs sm:text-sm font-display text-gray-400 uppercase tracking-wide mb-6 sm:mb-8">AVAILABLE DATES FOR THE NEXT 2 WEEKS</p>
                {loading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-[#CCFF00]" size={32} /></div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                    {dates.map((date) => {
                      const slots = getAvailableSlots(date);
                      const hasAvailability = slots.some(s => s.available);
                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => { if (hasAvailability) { setSelectedDate(date); setStep(3); } }}
                          disabled={!hasAvailability}
                          className={`p-3 sm:p-4 rounded-xl border-2 text-center transition-all ${
                            !hasAvailability ? 'border-gray-100 bg-black/[0.02] opacity-40 cursor-not-allowed'
                            : selectedDate?.toDateString() === date.toDateString() ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                            : 'border-white/20 hover:border-gray-300'
                          }`}
                        >
                          <span className="block text-[8px] sm:text-[10px] font-display font-black text-gray-400 uppercase mb-0.5 sm:mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="block text-xl sm:text-2xl font-display font-black text-white">{date.getDate()}</span>
                          <span className="block text-[8px] sm:text-[10px] font-display text-gray-400 uppercase">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                          {!hasAvailability && <span className="block text-[7px] sm:text-[8px] font-display font-black text-red-500/60 uppercase mt-1 sm:mt-2">FULL</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Time Selection */}
            {step === 3 && selectedDate && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5 sm:p-8 lg:p-12">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-gray-400 hover:text-white text-[10px] sm:text-xs font-display font-black uppercase tracking-widest mb-4 sm:mb-6 transition-colors">
                  <ChevronLeft size={14} /> BACK
                </button>
                <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight mb-2">SELECT A TIME</h3>
                <p className="text-xs sm:text-sm font-display text-gray-400 uppercase tracking-wide mb-6 sm:mb-8">{formatDate(selectedDate)} — MST</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                  {getAvailableSlots(selectedDate).map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => { if (slot.available) { setSelectedTime(slot.time); setStep(4); } }}
                      disabled={!slot.available}
                      className={`p-3 sm:p-4 rounded-xl border-2 text-center transition-all ${
                        !slot.available ? 'border-gray-100 bg-black/[0.02] cursor-not-allowed opacity-40'
                        : selectedTime === slot.time ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                        : 'border-white/20 hover:border-gray-300'
                      }`}
                    >
                      <span className={`block text-xs sm:text-sm font-display font-black uppercase ${slot.available ? 'text-white' : 'text-gray-400 line-through'}`}>{slot.display}</span>
                      {!slot.available && <span className="block text-[7px] sm:text-[8px] font-display font-black text-gray-500 uppercase mt-1">N/A</span>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Contact Details */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5 sm:p-8 lg:p-12">
                <button onClick={() => setStep(3)} className="flex items-center gap-2 text-gray-400 hover:text-white text-[10px] sm:text-xs font-display font-black uppercase tracking-widest mb-4 sm:mb-6 transition-colors">
                  <ChevronLeft size={14} /> BACK
                </button>
                <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight mb-2">YOUR DETAILS</h3>
                <p className="text-xs sm:text-sm font-display text-gray-400 uppercase tracking-wide mb-6 sm:mb-8">
                  {formatDate(selectedDate!)} @ {getTimeSlotsForType(meetingType).find(s => s.time === selectedTime)?.display} — {meetingType?.toUpperCase()}
                </p>
                {error && <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 text-xs sm:text-sm font-display uppercase tracking-wide">{error}</div>}
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="relative">
                      <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" placeholder="YOUR NAME *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="email" placeholder="EMAIL *" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="relative">
                      <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="tel" placeholder="PHONE" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
                    </div>
                    <div className="relative">
                      <Building className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" placeholder="BUSINESS NAME" value={formData.business} onChange={(e) => setFormData({ ...formData, business: e.target.value })} className={inputClass} />
                    </div>
                  </div>
                  {meetingType === 'in-person' && (
                    <div className="relative">
                      <MapPin className="absolute left-3 sm:left-4 top-4 sm:top-5 text-gray-400" size={16} />
                      <input type="text" placeholder="LOCATION (YOUR ADDRESS) *" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={inputClass} />
                    </div>
                  )}
                  <div className="relative">
                    <MessageSquare className="absolute left-3 sm:left-4 top-4 sm:top-5 text-gray-400" size={16} />
                    <textarea placeholder="NOTES (OPTIONAL)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !formData.name || !formData.email || (meetingType === 'in-person' && !formData.location)}
                    className="w-full py-5 sm:py-6 btn-primary text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                  >
                    {submitting ? (<><Loader2 className="animate-spin" size={18} /> BOOKING...</>) : (<>CONFIRM BOOKING <ChevronRight size={18} /></>)}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Call CTA */}
        <div className="mt-12 sm:mt-20 pt-12 sm:pt-20 border-t border-white/20 text-center">
          <p className="text-sm sm:text-base font-display font-medium text-gray-400 uppercase tracking-wide mb-6">Ready for a deeper dive?</p>
          <a href="tel:905-749-0266" className="inline-flex items-center gap-3 btn-glass px-8 py-4 sm:px-10 sm:py-5 text-xs sm:text-sm tracking-[0.2em] uppercase">
            <Phone size={18} /> CALL: 905-749-0266
          </a>
        </div>
      </div>
    </div>
  );
};
