import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, Key, CheckCircle, Loader2 } from 'lucide-react';
import { User as IUser } from '../types';
import { storage } from '../services/storageService';
import { useMobileAnimations } from '../hooks/useMobileAnimations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: IUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regStep, setRegStep] = useState(1);
  const [keyInput, setKeyInput] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isMobile, fadeProps, modalProps } = useMobileAnimations();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok && data.user) { onSuccess(data.user as IUser); onClose(); }
      else { setError(data.error || 'INVALID CREDENTIALS'); }
    } catch (err) { setError('LOGIN FAILED. TRY AGAIN.'); }
    finally { setLoading(false); }
  };

  const handleKeyValidation = () => {
    setError('');
    const users = storage.getUsers();
    const user = users.find(u => u.registrationKey === keyInput && !u.isRegistered);
    if (user) { setRegStep(2); }
    else { setError("INVALID OR EXPIRED REGISTRATION KEY."); }
  };

  const handleFinalizeReg = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError("PASSWORDS DO NOT MATCH."); return; }
    const finalizedUser = storage.finalizeRegistration(keyInput, formData.email, formData.password);
    if (finalizedUser) { storage.setCurrentUser(finalizedUser); onSuccess(finalizedUser); onClose(); }
    else { setError("ERROR FINALIZING REGISTRATION."); }
  };

  const inputClass = "w-full bg-transparent border-2 border-white/20 rounded-xl p-5 pl-14 focus:border-[#CCFF00] outline-none font-display font-bold uppercase text-xs tracking-widest text-white";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div {...fadeProps} className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
          <motion.div {...modalProps} className="relative w-full max-w-xl glass-strong rounded-2xl overflow-hidden">
            <div className="p-8 border-b border-white/20 flex items-center justify-between bg-gray-50">
              <h2 className="text-3xl font-display font-black uppercase tracking-tighter text-white">
                {mode === 'login' ? 'ACCESS HUB' : 'PRIVATE VAULT'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg transition-colors hover:bg-white/10 text-white"><X size={20} /></button>
            </div>

            <div className="p-10">
              {error && (
                <motion.div
                  {...(isMobile ? { initial: false, animate: { opacity: 1, height: 'auto' } } : { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' } })}
                  className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-[10px] font-body font-black tracking-widest text-center uppercase"
                >
                  {error}
                </motion.div>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input required type="email" placeholder="EMAIL ADDRESS" className={inputClass} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input required type="password" placeholder="PASSWORD" className={inputClass} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                  <button disabled={loading} className="w-full py-6 btn-primary tracking-[0.5em] uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                    {loading ? <><Loader2 size={18} className="animate-spin" /> AUTHENTICATING...</> : 'UNLOCK HUB'}
                  </button>
                </form>
              ) : (
                <div className="space-y-8">
                  {regStep === 1 ? (
                    <div className="space-y-8 text-center">
                      <div className="w-16 h-16 border-2 border-white/20 rounded-xl flex items-center justify-center mx-auto text-gray-400"><Key size={24} /></div>
                      <p className="text-[10px] font-body font-black tracking-widest text-gray-400 uppercase">ENTER THE REGISTRATION KEY PROVIDED BY YOUR ARCHITECT</p>
                      <input value={keyInput} onChange={e => setKeyInput(e.target.value.toUpperCase())} placeholder="SAL-XXXX-XXXX" className="w-full bg-transparent border-2 border-white/20 rounded-xl p-5 text-center focus:border-[#CCFF00] outline-none font-display font-black uppercase text-xl tracking-[0.2em] text-white" />
                      <button onClick={handleKeyValidation} className="w-full py-6 btn-primary tracking-[0.5em] uppercase">VALIDATE KEY</button>
                    </div>
                  ) : (
                    <form onSubmit={handleFinalizeReg} className="space-y-6">
                      <div className="flex items-center gap-4 p-4 glass rounded-xl mb-4">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-[9px] font-body font-black tracking-widest text-gray-400 uppercase">KEY VALIDATED. SETUP CREDENTIALS.</span>
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input required type="email" placeholder="SET LOGIN EMAIL" className={inputClass} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input required type="password" placeholder="SET PASSWORD" className={inputClass} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input required type="password" placeholder="CONFIRM PASSWORD" className={inputClass} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
                      </div>
                      <button className="w-full py-6 btn-primary tracking-[0.5em] uppercase">ACTIVATE ACCESS</button>
                    </form>
                  )}
                </div>
              )}

              <div className="text-center pt-10">
                <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setRegStep(1); setError(''); }}
                  className="text-[10px] font-body font-black tracking-widest uppercase transition-colors text-gray-400 hover:text-white">
                  {mode === 'login' ? "HAVE A KEY? REGISTER ACCESS" : "ALREADY REGISTERED? LOGIN HERE"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
