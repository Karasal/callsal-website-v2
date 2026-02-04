import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, MapPin, Phone, Loader2, X, Check, RefreshCw, AlertTriangle, Mail, ExternalLink } from 'lucide-react';
import { User } from '../types';
import { useMobileAnimations } from '../hooks/useMobileAnimations';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  meetingType: 'zoom' | 'in-person' | 'phone';
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cancelModal, setCancelModal] = useState<Booking | null>(null);
  const { isMobile, fadeProps, modalProps } = useMobileAnimations();

  const isAdmin = user.role === 'admin';

  useEffect(() => { if (isAdmin) fetchBookings(); }, [isAdmin]);

  const fetchBookings = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/bookings', { credentials: 'include' });
      if (res.status === 401) { setError('Session expired. Please login again.'); return; }
      const data = await res.json();
      if (data.success) setBookings(data.bookings || []);
      else setError(data.error || 'Failed to load bookings');
    } catch (err) { setError('Failed to connect to booking system'); }
    setLoading(false);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch('/api/admin/bookings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ id: bookingId, status: 'confirmed' }) });
      const data = await res.json();
      if (data.success) fetchBookings();
    } catch (err) { console.error('Failed to confirm booking:', err); }
    setActionLoading(null);
  };

  const handleCancelBooking = async (bookingId: string) => {
    setActionLoading(bookingId); setCancelModal(null);
    try {
      const res = await fetch(`/api/admin/bookings?id=${bookingId}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) fetchBookings();
    } catch (err) { console.error('Failed to cancel booking:', err); }
    setActionLoading(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'zoom': return <Video size={12} />;
      case 'in-person': return <MapPin size={12} />;
      case 'phone': return <Phone size={12} />;
      default: return null;
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="glass-strong rounded-2xl p-16">
          <h2 className="text-5xl font-display font-black uppercase tracking-tighter mb-4 leading-none">
            WELCOME, {user.name.split(' ')[0]}.
          </h2>
          <p className="text-sm font-display font-bold opacity-60 uppercase tracking-widest">CLIENT ACCESS GRANTED</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 md:px-0">
      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelModal && (
          <motion.div {...fadeProps} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setCancelModal(null)}>
            <motion.div {...modalProps} onClick={(e) => e.stopPropagation()} className="glass-strong rounded-2xl border-red-500/30 p-8 max-w-md w-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center"><AlertTriangle size={24} className="text-red-500" /></div>
                <div>
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">CANCEL BOOKING</h3>
                  <p className="text-xs font-display text-gray-400 uppercase tracking-wide">This action cannot be undone</p>
                </div>
              </div>
              <div className="glass rounded-xl p-4 mb-6">
                <p className="text-sm font-display font-bold text-white uppercase tracking-tight mb-2">{cancelModal.name}</p>
                <p className="text-xs font-display text-gray-400 uppercase">{formatDate(cancelModal.date)} at {formatTime(cancelModal.time)}</p>
                <p className="text-xs font-display text-gray-400 uppercase mt-2">{cancelModal.email}</p>
              </div>
              <p className="text-sm font-display text-gray-400 uppercase tracking-wide mb-8">This will remove the booking from your dashboard.</p>
              <div className="flex gap-3">
                <button onClick={() => setCancelModal(null)} className="flex-1 btn-glass px-6 py-4 text-[10px] tracking-widest uppercase">KEEP BOOKING</button>
                <button onClick={() => handleCancelBooking(cancelModal.id)} className="flex-1 px-6 py-4 bg-red-500 rounded-xl text-white font-display font-black text-[10px] tracking-widest uppercase hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                  <X size={14} /> CANCEL BOOKING
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-16">
        <span className="text-[12px] font-body tracking-[1em] text-gray-400 uppercase font-black block mb-8 leading-none">BOOKING MANAGEMENT</span>
        <h2 className="text-7xl md:text-8xl font-display font-black text-white uppercase tracking-tighter gradient-text leading-[0.85]">BOOKINGS.</h2>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="text-sm font-display font-black text-gray-400 uppercase tracking-widest">
            {bookings.length} UPCOMING {bookings.length === 1 ? 'BOOKING' : 'BOOKINGS'}
          </div>
          <a href="https://crm.callsal.app" className="btn-primary px-4 py-2 text-[9px] tracking-widest uppercase flex items-center gap-2">
            <ExternalLink size={12} /> CALL CENTER
          </a>
        </div>
        <button onClick={fetchBookings} disabled={loading} className="btn-glass px-6 py-3 text-[10px] tracking-widest uppercase flex items-center gap-2">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} REFRESH
        </button>
      </div>

      {error && <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-display uppercase tracking-wide">{error}</div>}

      {loading && bookings.length === 0 ? (
        <div className="flex items-center justify-center py-32"><Loader2 className="animate-spin text-gray-400" size={40} /></div>
      ) : bookings.length === 0 ? (
        <div className="glass rounded-2xl p-20 text-center">
          <Calendar size={56} className="mx-auto mb-8 text-gray-500" />
          <p className="text-xl font-display font-black text-gray-400 uppercase tracking-wide mb-2">NO UPCOMING BOOKINGS</p>
          <p className="text-xs font-display text-gray-500 uppercase tracking-wide">Bookings from callsal.app will appear here</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isLoading = actionLoading === booking.id;
              return (
                <motion.div
                  key={booking.id}
                  {...(isMobile ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } })}
                  className={`glass rounded-2xl p-6 lg:p-8 border-l-4 ${
                    booking.status === 'pending' ? 'border-yellow-500 bg-yellow-500/5' :
                    booking.status === 'confirmed' ? 'border-green-500 bg-green-500/5' :
                    'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-display font-black uppercase tracking-widest ${
                          booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' :
                          booking.status === 'confirmed' ? 'bg-green-500/20 text-green-600' :
                          'bg-white/10 text-gray-400'
                        }`}>{booking.status.toUpperCase()}</span>
                        <span className="flex items-center gap-1 px-3 py-1 glass rounded-lg text-[9px] font-display font-black text-gray-400 uppercase tracking-widest">
                          {getMeetingIcon(booking.meetingType)}<span className="ml-1">{booking.meetingType}</span>
                        </span>
                      </div>
                      <h4 className="text-xl font-display font-black text-white uppercase tracking-tight mb-3">{booking.name}</h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-display text-[#CCFF00] uppercase tracking-wide mb-4">
                        <span className="flex items-center gap-2"><Calendar size={14} />{formatDate(booking.date)}</span>
                        <span className="flex items-center gap-2"><Clock size={14} />{formatTime(booking.time)}</span>
                      </div>
                      <div className="space-y-1 text-sm font-display text-gray-400 uppercase tracking-wide mb-4">
                        <div className="flex items-center gap-2"><Mail size={12} className="text-gray-400" />{booking.email}</div>
                        {booking.phone && <div className="flex items-center gap-2"><Phone size={12} className="text-gray-400" />{booking.phone}</div>}
                      </div>
                      {booking.notes && (
                        <div className="p-4 glass rounded-xl border-l-2 border-[#CCFF00]/30">
                          <p className="text-sm font-display text-white/70 leading-relaxed">{booking.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 lg:ml-8">
                      {booking.status === 'pending' && (
                        <button onClick={() => handleConfirmBooking(booking.id)} disabled={isLoading}
                          className="px-8 py-4 bg-green-500 rounded-xl text-black font-display font-black text-[10px] tracking-widest uppercase hover:bg-green-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} CONFIRM
                        </button>
                      )}
                      <button onClick={() => setCancelModal(booking)} disabled={isLoading}
                        className="px-8 py-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-display font-black text-[10px] tracking-widest uppercase hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} CANCEL
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};
