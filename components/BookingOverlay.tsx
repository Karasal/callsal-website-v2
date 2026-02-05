import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Loader2, Video, MapPin, Phone, User, Mail, Building, MessageSquare, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingOverlayProps {
  isActive: boolean;
  onClose: () => void;
  scrollProgress: number;
  smoothMouse: { x: number; y: number };
}

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
  { id: 'zoom' as MeetingType, icon: Video, label: 'ZOOM CALL', desc: 'VIDEO CONFERENCE FROM ANYWHERE' },
  { id: 'in-person' as MeetingType, icon: MapPin, label: 'IN-PERSON', desc: 'MEET AT YOUR PLACE OF BUSINESS' },
  { id: 'phone' as MeetingType, icon: Phone, label: 'PHONE CALL', desc: 'QUICK AND CONVENIENT' },
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

export const BookingOverlay: React.FC<BookingOverlayProps> = ({
  isActive,
  onClose,
  scrollProgress,
  smoothMouse,
}) => {
  const [showPanel, setShowPanel] = useState(false);
  const [step, setStep] = useState(1);
  const [meetingType, setMeetingType] = useState<MeetingType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', business: '', location: '', notes: '',
  });

  // Animation sequence
  useEffect(() => {
    if (isActive) {
      const t1 = setTimeout(() => setShowPanel(true), 100);
      return () => clearTimeout(t1);
    } else {
      setShowPanel(false);
    }
  }, [isActive]);

  // Reset state when closing
  useEffect(() => {
    if (!isActive) {
      const t = setTimeout(() => {
        setStep(1);
        setMeetingType(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setSuccess(false);
        setError('');
        setFormData({ name: '', email: '', phone: '', business: '', location: '', notes: '' });
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  // Fetch availability on open
  useEffect(() => {
    if (isActive) fetchAvailability();
  }, [isActive]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings/availability');
      const data = await res.json();
      if (data.success) setBookedSlots(data.bookedSlots || []);
    } catch (err) { console.error('Failed to fetch availability:', err); }
    setLoading(false);
  };

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 2);
    return date;
  }).filter(d => d.getDay() !== 0 && d.getDay() !== 6);

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

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

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
            date: dateStr, time: selectedTime, meetingType,
            notes: `Business: ${formData.business || 'Not provided'}${meetingType === 'in-person' ? `\nLocation: ${formData.location}` : ''}${formData.notes ? `\nNotes: ${formData.notes}` : ''}`,
          },
        }),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.error || 'Failed to book meeting');
    } catch (err) { setError('Something went wrong. Please try again.'); }
    setSubmitting(false);
  };

  if (!isActive) return null;

  // Subtle parallax
  const parallaxX = (smoothMouse.x - 0.5) * 20;
  const parallaxY = (smoothMouse.y - 0.5) * 12;

  const inputClass = "w-full bg-transparent border-2 border-white/20 rounded-xl p-4 pl-12 focus:border-[#CCFF00] outline-none font-display font-bold uppercase text-xs tracking-wide text-white placeholder:text-gray-500";

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-[100] pointer-events-auto"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translate(${parallaxX}px, ${parallaxY}px)`,
            width: 'min(680px, 90vw)',
            maxHeight: '80vh',
          }}
        >
          <div className="w-full bg-black/95 rounded-2xl border border-white/15 overflow-hidden shadow-2xl shadow-black/60">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-[#CCFF00]" />
                <span className="text-[10px] font-body tracking-[0.3em] text-[#CCFF00] uppercase font-bold">QUICK BOOK</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(80vh - 56px)' }}>
              {/* Success state */}
              {success ? (
                <div className="p-8 lg:p-12 text-center">
                  <div className="w-16 h-16 bg-[#CCFF00] rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Check size={28} className="text-black" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tighter mb-4">YOU'RE BOOKED!</h3>
                  <p className="text-sm font-display font-bold text-gray-400 uppercase tracking-wide mb-2">
                    {formatDate(selectedDate!)} at {getTimeSlotsForType(meetingType).find(s => s.time === selectedTime)?.display}
                  </p>
                  <p className="text-xs font-display text-gray-500 uppercase tracking-wider mb-8">CHECK YOUR EMAIL FOR CONFIRMATION</p>
                  <button onClick={onClose} className="btn-primary px-8 py-4 text-xs tracking-[0.2em]">DONE</button>
                </div>
              ) : (
                <>
                  {/* Progress steps */}
                  <div className="flex items-center justify-center gap-3 pt-5 pb-2">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-xs transition-all ${
                          step >= s ? 'bg-[#CCFF00] text-black' : 'bg-white/10 text-gray-500'
                        }`}>
                          {s}
                        </div>
                        {s < 4 && <div className={`w-8 h-0.5 rounded-full ${step > s ? 'bg-[#CCFF00]' : 'bg-white/10'}`} />}
                      </div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {/* Step 1: Meeting Type */}
                    {step === 1 && (
                      <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6">
                        <h3 className="text-lg font-display font-black text-white uppercase tracking-tight mb-1">HOW WOULD YOU LIKE TO MEET?</h3>
                        <p className="text-[10px] font-display text-gray-500 uppercase tracking-wide mb-5">SELECT YOUR PREFERRED FORMAT</p>
                        <div className="grid grid-cols-3 gap-3">
                          {MEETING_TYPES.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => { setMeetingType(type.id); setStep(2); }}
                              className={`p-5 rounded-xl border-2 text-left transition-all ${
                                meetingType === type.id ? 'border-[#CCFF00] bg-[#CCFF00]/10' : 'border-white/15 hover:border-white/30'
                              }`}
                            >
                              <type.icon size={22} className={`mb-3 ${meetingType === type.id ? 'text-[#CCFF00]' : 'text-gray-500'}`} />
                              <h4 className="text-sm font-display font-black text-white uppercase tracking-tight mb-1">{type.label}</h4>
                              <p className="text-[8px] font-display text-gray-500 uppercase tracking-wide">{type.desc}</p>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Date */}
                    {step === 2 && (
                      <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6">
                        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-display font-black uppercase tracking-widest mb-4 transition-colors">
                          <ChevronLeft size={12} /> BACK
                        </button>
                        <h3 className="text-lg font-display font-black text-white uppercase tracking-tight mb-1">PICK A DATE</h3>
                        <p className="text-[10px] font-display text-gray-500 uppercase tracking-wide mb-5">NEXT 2 WEEKS</p>
                        {loading ? (
                          <div className="flex items-center justify-center py-8"><Loader2 className="animate-spin text-[#CCFF00]" size={24} /></div>
                        ) : (
                          <div className="grid grid-cols-5 gap-2">
                            {dates.map((date) => {
                              const slots = getAvailableSlots(date);
                              const hasAvailability = slots.some(s => s.available);
                              return (
                                <button
                                  key={date.toISOString()}
                                  onClick={() => { if (hasAvailability) { setSelectedDate(date); setStep(3); } }}
                                  disabled={!hasAvailability}
                                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                                    !hasAvailability ? 'border-white/5 opacity-30 cursor-not-allowed'
                                    : selectedDate?.toDateString() === date.toDateString() ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                                    : 'border-white/15 hover:border-white/30'
                                  }`}
                                >
                                  <span className="block text-[8px] font-display font-black text-gray-500 uppercase mb-0.5">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                  <span className="block text-lg font-display font-black text-white">{date.getDate()}</span>
                                  <span className="block text-[8px] font-display text-gray-500 uppercase">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Step 3: Time */}
                    {step === 3 && selectedDate && (
                      <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6">
                        <button onClick={() => setStep(2)} className="flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-display font-black uppercase tracking-widest mb-4 transition-colors">
                          <ChevronLeft size={12} /> BACK
                        </button>
                        <h3 className="text-lg font-display font-black text-white uppercase tracking-tight mb-1">SELECT A TIME</h3>
                        <p className="text-[10px] font-display text-gray-500 uppercase tracking-wide mb-5">{formatDate(selectedDate)} — MST</p>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {getAvailableSlots(selectedDate).map((slot) => (
                            <button
                              key={slot.time}
                              onClick={() => { if (slot.available) { setSelectedTime(slot.time); setStep(4); } }}
                              disabled={!slot.available}
                              className={`p-3 rounded-xl border-2 text-center transition-all ${
                                !slot.available ? 'border-white/5 cursor-not-allowed opacity-30'
                                : selectedTime === slot.time ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                                : 'border-white/15 hover:border-white/30'
                              }`}
                            >
                              <span className={`block text-xs font-display font-black uppercase ${slot.available ? 'text-white' : 'text-gray-500 line-through'}`}>{slot.display}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Contact */}
                    {step === 4 && (
                      <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6">
                        <button onClick={() => setStep(3)} className="flex items-center gap-2 text-gray-500 hover:text-white text-[10px] font-display font-black uppercase tracking-widest mb-4 transition-colors">
                          <ChevronLeft size={12} /> BACK
                        </button>
                        <h3 className="text-lg font-display font-black text-white uppercase tracking-tight mb-1">YOUR DETAILS</h3>
                        <p className="text-[10px] font-display text-gray-500 uppercase tracking-wide mb-5">
                          {formatDate(selectedDate!)} @ {getTimeSlotsForType(meetingType).find(s => s.time === selectedTime)?.display} — {meetingType?.toUpperCase()}
                        </p>
                        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-display uppercase tracking-wide">{error}</div>}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                              <input type="text" placeholder="YOUR NAME *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                            </div>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                              <input type="email" placeholder="EMAIL *" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                              <input type="tel" placeholder="PHONE" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
                            </div>
                            <div className="relative">
                              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                              <input type="text" placeholder="BUSINESS NAME" value={formData.business} onChange={(e) => setFormData({ ...formData, business: e.target.value })} className={inputClass} />
                            </div>
                          </div>
                          {meetingType === 'in-person' && (
                            <div className="relative">
                              <MapPin className="absolute left-4 top-4 text-gray-500" size={14} />
                              <input type="text" placeholder="LOCATION (YOUR ADDRESS) *" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={inputClass} />
                            </div>
                          )}
                          <div className="relative">
                            <MessageSquare className="absolute left-4 top-4 text-gray-500" size={14} />
                            <textarea placeholder="NOTES (OPTIONAL)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
                          </div>
                          <button
                            onClick={handleSubmit}
                            disabled={submitting || !formData.name || !formData.email || (meetingType === 'in-person' && !formData.location)}
                            className="w-full py-4 btn-primary text-xs tracking-[0.2em] uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {submitting ? (<><Loader2 className="animate-spin" size={16} /> BOOKING...</>) : (<>CONFIRM BOOKING <ChevronRight size={16} /></>)}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingOverlay;
