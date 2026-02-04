import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ArrowLeft, Check, Sparkles, Building2, BookOpen,
  Gift, Calendar, Phone, Send, Loader2
} from 'lucide-react'
import { User } from '../types';

const TIME_PREFERENCES = [
  { value: 'morning', label: 'Morning (9am - 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
  { value: 'evening', label: 'Evening (5pm - 8pm)' },
  { value: 'flexible', label: 'Flexible - Any time works' },
]

const INDUSTRIES = [
  'Fitness & Wellness', 'Restaurant & Food Service', 'Retail & Shopping',
  'Professional Services', 'Home Services', 'Healthcare',
  'Real Estate', 'Automotive', 'Beauty & Personal Care', 'Other'
]

interface ClientHubOnboardingProps {
  user: User;
  onComplete: () => void;
}

export default function ClientHubOnboarding({ user, onComplete }: ClientHubOnboardingProps) {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const inputRef = useRef<any>(null)

  interface FormData {
    businessName: string; industry: string; website: string;
    ownerStory: string; mission: string; specialOffer: string;
    shootDay1: { date: string; timePreference: string };
    shootDay2: { date: string; timePreference: string };
    phone: string;
  }

  const [formData, setFormData] = useState<FormData>({
    businessName: '', industry: '', website: '',
    ownerStory: '', mission: '', specialOffer: '',
    shootDay1: { date: '', timePreference: '' },
    shootDay2: { date: '', timePreference: '' },
    phone: '',
  })

  useEffect(() => {
    const timer = setTimeout(() => { inputRef.current?.focus() }, 400)
    return () => clearTimeout(timer)
  }, [step])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if ((e.target as HTMLElement).tagName === 'TEXTAREA') return
        if (canAdvance()) { e.preventDefault(); nextStep() }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [step, formData])

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (parent: 'shootDay1' | 'shootDay2', field: string, value: string) => {
    setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }))
  }

  const canAdvance = () => {
    switch (step) {
      case 0: return true
      case 1: return formData.businessName.trim().length > 0
      case 2: return formData.industry.length > 0
      case 3: return true
      case 4: return formData.ownerStory.trim().length > 20
      case 5: return formData.mission.trim().length > 10
      case 6: return formData.specialOffer.trim().length > 10
      case 7: return formData.shootDay1.date && formData.shootDay1.timePreference
      case 8: return formData.shootDay2.date && formData.shootDay2.timePreference
      case 9: return formData.phone.trim().length >= 10
      case 10: return true
      default: return false
    }
  }

  const nextStep = () => { if (step < steps.length - 1) setStep(step + 1) }
  const prevStep = () => { if (step > 0) setStep(step - 1) }

  const handleSubmit = async () => {
    setIsSubmitting(true); setSubmitError(null)
    try {
      const response = await fetch('/api/client/onboarding', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ clientId: user.id, clientEmail: user.email, clientName: user.name, ...formData, submittedAt: new Date().toISOString() })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to submit onboarding')
      onComplete()
    } catch (err) {
      console.error('[Onboarding] Submit error:', err)
      setSubmitError('Something went wrong. Please try again.')
    } finally { setIsSubmitting(false) }
  }

  const inputClass = "w-full bg-white/10 border-2 border-white/20 rounded-xl p-3 text-sm text-white outline-none focus:border-[#CCFF00] transition-all placeholder:text-gray-400"

  const steps = [
    { icon: Sparkles, title: `Welcome, ${user?.name || 'there'}!`, subtitle: "Thanks for meeting with me! Now let's get to know YOU and your business so we can create an amazing video together.",
      content: (<div className="text-center"><p className="text-sm text-gray-400 mb-8">This should take about 5 minutes. Your answers help me prepare for your shoot.</p></div>),
      buttonText: "Let's Begin" },
    { icon: Building2, title: "What's your business name?", subtitle: "The name your customers know you by",
      content: (<input ref={inputRef} type="text" value={formData.businessName} onChange={(e) => updateField('businessName', e.target.value)} placeholder="e.g. Peak Performance Gym" className={inputClass} style={{ borderColor: formData.businessName ? '#CCFF00' : undefined }} />) },
    { icon: Building2, title: "What industry are you in?", subtitle: "This helps us tailor the video style",
      content: (<div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto">{INDUSTRIES.map(industry => (
        <button key={industry} onClick={() => updateField('industry', industry)}
          className={`p-3 text-left text-sm rounded-xl transition-all ${formData.industry === industry ? 'bg-[#CCFF00]/20 border border-[#CCFF00] text-white font-medium' : 'glass border border-white/20 text-white/70'}`}>{industry}</button>
      ))}</div>) },
    { icon: Building2, title: "What's your website?", subtitle: "Optional - helps us research your brand", optional: true,
      content: (<input ref={inputRef} type="url" value={formData.website} onChange={(e) => updateField('website', e.target.value)} placeholder="https://yourbusiness.com" className={inputClass} style={{ borderColor: formData.website ? '#CCFF00' : undefined }} />) },
    { icon: BookOpen, title: "Tell me your story", subtitle: "How did you start this business? What made you take the leap?", hint: "Press Shift+Enter for new line, Tab to continue",
      content: (<textarea ref={inputRef} value={formData.ownerStory} onChange={(e) => updateField('ownerStory', e.target.value)} placeholder="I started my business because..." rows={3} className={`${inputClass} resize-none`} style={{ borderColor: formData.ownerStory.length > 20 ? '#CCFF00' : undefined }} />) },
    { icon: BookOpen, title: "What drives you?", subtitle: "What's your mission? Why do you do what you do?", hint: "This passion will shine through in your video!",
      content: (<textarea ref={inputRef} value={formData.mission} onChange={(e) => updateField('mission', e.target.value)} placeholder="My mission is to..." rows={3} className={`${inputClass} resize-none`} style={{ borderColor: formData.mission.length > 10 ? '#CCFF00' : undefined }} />) },
    { icon: Gift, title: "What's your special offer?", subtitle: "What promotion or deal are you extending to customers with this video?", hint: "This is the call-to-action we'll feature in your video",
      content: (<textarea ref={inputRef} value={formData.specialOffer} onChange={(e) => updateField('specialOffer', e.target.value)} placeholder="e.g. 50% off first month, Free consultation..." rows={2} className={`${inputClass} resize-none`} style={{ borderColor: formData.specialOffer.length > 10 ? '#CCFF00' : undefined }} />) },
    { icon: Calendar, title: "Schedule your first shoot", subtitle: "Pick a day and time for your first 2-hour session",
      content: (<div className="space-y-3">
        <div><label className="block text-xs uppercase tracking-wider mb-1 text-gray-400">Preferred Date</label>
          <input ref={inputRef} type="date" value={formData.shootDay1.date} onChange={(e) => updateNestedField('shootDay1', 'date', e.target.value)} min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} className={inputClass} style={{ borderColor: formData.shootDay1.date ? '#CCFF00' : undefined }} /></div>
        <div><label className="block text-xs uppercase tracking-wider mb-1 text-gray-400">Time Preference</label>
          <div className="grid grid-cols-2 gap-1.5">{TIME_PREFERENCES.map(opt => (
            <button key={opt.value} onClick={() => updateNestedField('shootDay1', 'timePreference', opt.value)}
              className={`p-2 text-xs text-left rounded-lg transition-all ${formData.shootDay1.timePreference === opt.value ? 'bg-[#CCFF00]/20 border border-[#CCFF00] text-white font-medium' : 'glass border border-white/20 text-white/70'}`}>{opt.label}</button>
          ))}</div></div></div>) },
    { icon: Calendar, title: "Schedule your second shoot", subtitle: "Pick a day and time for your second 2-hour session", hint: "We recommend scheduling shoots a few days apart",
      content: (<div className="space-y-3">
        <div><label className="block text-xs uppercase tracking-wider mb-1 text-gray-400">Preferred Date</label>
          <input ref={inputRef} type="date" value={formData.shootDay2.date} onChange={(e) => updateNestedField('shootDay2', 'date', e.target.value)} min={formData.shootDay1.date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} className={inputClass} style={{ borderColor: formData.shootDay2.date ? '#CCFF00' : undefined }} /></div>
        <div><label className="block text-xs uppercase tracking-wider mb-1 text-gray-400">Time Preference</label>
          <div className="grid grid-cols-2 gap-1.5">{TIME_PREFERENCES.map(opt => (
            <button key={opt.value} onClick={() => updateNestedField('shootDay2', 'timePreference', opt.value)}
              className={`p-2 text-xs text-left rounded-lg transition-all ${formData.shootDay2.timePreference === opt.value ? 'bg-[#CCFF00]/20 border border-[#CCFF00] text-white font-medium' : 'glass border border-white/20 text-white/70'}`}>{opt.label}</button>
          ))}</div></div></div>) },
    { icon: Phone, title: "Best number to reach you?", subtitle: "We'll text you shoot reminders and updates",
      content: (<input ref={inputRef} type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="(403) 555-1234" className={inputClass} style={{ borderColor: formData.phone.length >= 10 ? '#CCFF00' : undefined }} />) },
    { icon: Send, title: "Ready to submit?", subtitle: "Review your information below", buttonText: "Submit & Continue",
      content: (<div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        <ReviewItem label="Business" value={formData.businessName} />
        <ReviewItem label="Industry" value={formData.industry} />
        {formData.website && <ReviewItem label="Website" value={formData.website} />}
        <ReviewItem label="Your Story" value={formData.ownerStory} truncate />
        <ReviewItem label="Mission" value={formData.mission} truncate />
        <ReviewItem label="Special Offer" value={formData.specialOffer} />
        <ReviewItem label="Shoot Day 1" value={`${new Date(formData.shootDay1.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} - ${TIME_PREFERENCES.find(t => t.value === formData.shootDay1.timePreference)?.label}`} />
        <ReviewItem label="Shoot Day 2" value={`${new Date(formData.shootDay2.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} - ${TIME_PREFERENCES.find(t => t.value === formData.shootDay2.timePreference)?.label}`} />
        <ReviewItem label="Phone" value={formData.phone} />
      </div>) }
  ]

  const currentStep = steps[step]
  const Icon = currentStep.icon
  const progress = ((step) / (steps.length - 1)) * 100

  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-8 bg-transparent">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-200">
        <motion.div className="h-full bg-[#CCFF00]" style={{ boxShadow: '0 0 20px rgba(204, 255, 0, 0.3)' }} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      {/* Step Counter */}
      <div className="fixed top-3 right-4 z-50">
        <span className="text-xs font-body text-gray-400">{step + 1} / {steps.length}</span>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-xl relative z-10 flex flex-col items-center max-h-[calc(100vh-4rem)]">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="text-center w-full flex flex-col">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="w-12 h-12 mx-auto mb-4 flex items-center justify-center shrink-0 glass rounded-xl border border-[#CCFF00]"
              style={{ boxShadow: '0 0 20px rgba(204, 255, 0, 0.3)' }}>
              <Icon size={22} className="text-[#CCFF00]" />
            </motion.div>

            <h1 className="text-xl md:text-2xl font-display font-bold text-white mb-1 shrink-0">{currentStep.title}</h1>
            <p className="text-sm text-white/70 mb-4 shrink-0">{currentStep.subtitle}</p>

            <div className="text-left mb-4 flex-1 min-h-0 overflow-y-auto">{currentStep.content}</div>

            {currentStep.hint && <p className="text-xs mb-3 shrink-0 text-gray-400">{currentStep.hint}</p>}
            {submitError && <p className="text-sm mb-3 text-red-500 shrink-0">{submitError}</p>}

            <div className="flex items-center justify-between gap-4 shrink-0 mt-2">
              {step > 0 ? (
                <button onClick={prevStep} className="flex items-center gap-1.5 px-4 py-2 text-sm btn-glass rounded-lg text-white/80"><ArrowLeft size={14} /> Back</button>
              ) : <div />}

              {step === steps.length - 1 ? (
                <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-6 py-2 text-sm font-bold btn-primary rounded-lg disabled:opacity-50">
                  {isSubmitting ? (<><Loader2 size={14} className="animate-spin" /> Submitting...</>) : (<>{currentStep.buttonText || 'Submit'} <Check size={14} /></>)}
                </button>
              ) : (
                <button onClick={nextStep} disabled={!canAdvance()}
                  className={`flex items-center gap-1.5 px-6 py-2 text-sm font-bold rounded-lg transition-all ${canAdvance() ? 'btn-primary' : 'bg-white/10 text-gray-400 cursor-not-allowed'}`}
                  style={canAdvance() ? { boxShadow: '0 0 20px rgba(204, 255, 0, 0.3)' } : {}}>
                  {currentStep.buttonText || 'Continue'} <ArrowRight size={14} />
                </button>
              )}
            </div>

            {currentStep.optional && <p className="text-xs mt-2 shrink-0 text-gray-400">Press Enter to skip</p>}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; }
      `}</style>
    </div>
  )
}

function ReviewItem({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="glass rounded-lg p-2 text-left border border-white/20">
      <p className="text-[10px] uppercase tracking-wider mb-0.5 text-gray-400">{label}</p>
      <p className={`text-xs text-white ${truncate ? 'line-clamp-1' : ''}`}>{value}</p>
    </div>
  )
}
