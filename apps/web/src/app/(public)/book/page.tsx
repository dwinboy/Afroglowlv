'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import {
  CheckCircle, Calendar, Clock, User,
  Scissors, ChevronLeft, ChevronRight, Star, Loader,
} from 'lucide-react'
import { cn, generateTimeSlots, formatPrice } from '@/lib/utils'
import { api } from '@/contexts/AuthContext'

const STEPS = ['Service', 'Professional', 'Date & Time', 'Details', 'Confirm']

interface ApiService {
  id: string; name: string; category: string; price: number
  duration: number; icon: string | null; description: string | null; isPopular: boolean
}

interface ApiProfessional {
  id: string
  user: { fullName: string; avatarUrl: string | null }
  specialization: string
  avgRating: number
  services: { id: string; name: string }[]
  portfolio: { imageUrl: string }[]
}

const detailsSchema = z.object({
  fullName: z.string().min(2, 'Name required'),
  email:    z.string().email('Valid email required'),
  phone:    z.string().min(8, 'Phone required'),
  notes:    z.string().optional(),
})
type DetailsForm = z.infer<typeof detailsSchema>

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year: number, month: number) { return new Date(year, month, 1).getDay() }
const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December']

export default function BookingPage() {
  const params = useSearchParams()
  const [step, setStep] = useState(0)

  // Live data
  const [services,     setServices]     = useState<ApiService[]>([])
  const [professionals,setProfessionals] = useState<ApiProfessional[]>([])
  const [dataLoading,  setDataLoading]  = useState(true)

  // Selections
  const [selectedService,      setSelectedService]      = useState<ApiService | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<ApiProfessional | null>(null)
  const [selectedDate,         setSelectedDate]         = useState<Date | null>(null)
  const [selectedTime,         setSelectedTime]         = useState<string | null>(null)
  const [bookingId,            setBookingId]            = useState<string | null>(null)

  const today = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } =
    useForm<DetailsForm>({ resolver: zodResolver(detailsSchema) })

  const timeSlots = generateTimeSlots(9, 21, 30)

  useEffect(() => {
    Promise.all([
      api.get('/services').then(r => setServices(r.data)),
      api.get('/professionals').then(r => setProfessionals(r.data?.data ?? r.data ?? [])),
    ]).catch(() => {}).finally(() => setDataLoading(false))
  }, [])

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1) } else setViewMonth(m => m-1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1) } else setViewMonth(m => m+1) }

  const daysInMonth    = getDaysInMonth(viewYear, viewMonth)
  const firstDay       = getFirstDayOfMonth(viewYear, viewMonth)
  const calendarDays   = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const leadingBlanks  = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 })

  // Filter professionals who offer the selected service
  const availablePros = selectedService
    ? professionals.filter(p => p.services.some(s => s.id === selectedService.id || s.name === selectedService.name))
    : professionals

  const onConfirm = async (details: DetailsForm) => {
    try {
      const { data } = await api.post('/bookings', {
        serviceId:      selectedService?.id,
        professionalId: selectedProfessional?.id,
        date:           selectedDate?.toISOString().split('T')[0],
        time:           selectedTime,
        ...details,
      })
      setBookingId(data.id?.slice(0, 8).toUpperCase() ?? 'AG-' + Math.random().toString(36).slice(2,8).toUpperCase())
      setStep(5)
      toast.success('Booking confirmed!')
    } catch {
      toast.error('Booking failed. Please try again.')
    }
  }

  /* ── STEPS ────────────────────────────────────── */

  const StepService = () => (
    <div>
      <h2 className="text-2xl font-serif font-bold text-white mb-2">Choose a Service</h2>
      <p className="text-gray-400 mb-8">Select the service you'd like to book</p>
      {dataLoading ? (
        <div className="flex items-center justify-center py-16"><Loader size={32} className="text-gold-400 animate-spin" /></div>
      ) : services.length === 0 ? (
        <div className="card-luxury p-12 text-center text-gray-400">No services available yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map(s => (
            <button key={s.id} onClick={() => { setSelectedService(s); setStep(1) }}
              className={cn('card-luxury p-5 text-left transition-all duration-200 relative',
                selectedService?.id === s.id && 'border-gold-500/50 shadow-gold')}>
              {s.isPopular && (
                <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30">Popular</span>
              )}
              <div className="text-3xl mb-3">{s.icon ?? '✂️'}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{s.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{s.duration} min</p>
              <span className="text-sm font-bold text-gradient-gold">{formatPrice(s.price)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const StepProfessional = () => (
    <div>
      <h2 className="text-2xl font-serif font-bold text-white mb-2">Choose a Professional</h2>
      <p className="text-gray-400 mb-8">
        {availablePros.length > 0
          ? 'Pick your preferred expert'
          : 'Showing all available professionals'}
      </p>
      {dataLoading ? (
        <div className="flex items-center justify-center py-16"><Loader size={32} className="text-gold-400 animate-spin" /></div>
      ) : availablePros.length === 0 ? (
        <div className="card-luxury p-12 text-center">
          <Scissors size={32} className="mx-auto text-gray-500 mb-4" />
          <p className="text-white font-medium mb-1">No professionals available yet</p>
          <p className="text-sm text-gray-400">Our team is being set up. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availablePros.map(pro => (
            <button key={pro.id} onClick={() => { setSelectedProfessional(pro); setStep(2) }}
              className={cn('card-luxury p-5 flex items-center gap-4 text-left transition-all duration-200',
                selectedProfessional?.id === pro.id && 'border-gold-500/50 shadow-gold')}>
              {pro.user.avatarUrl ? (
                <Image src={pro.user.avatarUrl} alt={pro.user.fullName} width={56} height={56}
                  className="rounded-full avatar-gold object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center text-luxury-black font-bold text-xl flex-shrink-0">
                  {pro.user.fullName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{pro.user.fullName}</h3>
                <p className="text-xs text-gray-400">{pro.specialization ?? 'Professional'}</p>
                {pro.avgRating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-gold-400 fill-gold-400" />
                    <span className="text-xs font-semibold text-white">{pro.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              {selectedProfessional?.id === pro.id && <CheckCircle size={20} className="text-gold-400 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const StepDateTime = () => (
    <div>
      <h2 className="text-2xl font-serif font-bold text-white mb-2">Select Date & Time</h2>
      <p className="text-gray-400 mb-8">Choose your preferred appointment slot</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card-luxury p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-luxury-muted/50 text-gray-400 hover:text-white">
              <ChevronLeft size={18} />
            </button>
            <span className="font-semibold text-white text-sm">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-luxury-muted/50 text-gray-400 hover:text-white">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
              <div key={d} className="text-center text-xs text-gray-500 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {leadingBlanks.map((_, i) => <div key={`b-${i}`} />)}
            {calendarDays.map(day => {
              const date   = new Date(viewYear, viewMonth, day)
              const isPast = date < new Date(today.toDateString())
              const isToday = date.toDateString() === today.toDateString()
              const isSel  = selectedDate?.toDateString() === date.toDateString()
              return (
                <button key={day} disabled={isPast} onClick={() => setSelectedDate(date)}
                  className={cn('w-8 h-8 text-xs rounded-lg transition-all mx-auto',
                    isPast    ? 'text-gray-600 cursor-not-allowed' : 'hover:bg-luxury-muted/50',
                    isToday   ? 'border border-gold-500/40 text-gold-400' : 'text-gray-300',
                    isSel     ? 'bg-gradient-gold text-luxury-black font-bold' : '')}>
                  {day}
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4 text-sm">
            {selectedDate ? `Available slots for ${selectedDate.toLocaleDateString('en', { weekday:'long', month:'short', day:'numeric' })}` : 'Select a date first'}
          </h3>
          <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto">
            {selectedDate ? timeSlots.map(slot => (
              <button key={slot} onClick={() => setSelectedTime(slot)}
                className={cn('px-3 py-2 rounded-xl text-xs font-medium transition-all border',
                  selectedTime === slot
                    ? 'bg-gradient-gold text-luxury-black border-gold-500'
                    : 'border-luxury-border text-gray-300 hover:border-gold-500/30 hover:text-white')}>
                {slot}
              </button>
            )) : <p className="col-span-3 text-xs text-gray-500 text-center py-8">Pick a date to see available times</p>}
          </div>
        </div>
      </div>
    </div>
  )

  const StepDetails = () => (
    <div>
      <h2 className="text-2xl font-serif font-bold text-white mb-2">Your Details</h2>
      <p className="text-gray-400 mb-8">Tell us how to reach you</p>
      <div className="card-luxury p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label-luxury">Full Name *</label>
            <input {...register('fullName')} className="input-luxury" placeholder="John Doe" />
            {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="label-luxury">Email *</label>
            <input {...register('email')} type="email" className="input-luxury" placeholder="you@example.com" />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label-luxury">Phone *</label>
            <input {...register('phone')} className="input-luxury" placeholder="+370 600 00000" />
            {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="label-luxury">Special Requests</label>
            <input {...register('notes')} className="input-luxury" placeholder="Any notes for your professional…" />
          </div>
        </div>
      </div>
    </div>
  )

  const StepConfirm = () => {
    const details = getValues()
    return (
      <div>
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Confirm Your Booking</h2>
        <p className="text-gray-400 mb-8">Review the details before confirming</p>
        <div className="card-luxury p-6 space-y-4">
          {[
            { label: 'Service',      value: `${selectedService?.icon ?? ''} ${selectedService?.name}`.trim() },
            { label: 'Professional', value: selectedProfessional?.user.fullName },
            { label: 'Date',         value: selectedDate?.toLocaleDateString('en', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) },
            { label: 'Time',         value: selectedTime },
            { label: 'Duration',     value: `${selectedService?.duration} min` },
            { label: 'Price',        value: selectedService ? formatPrice(selectedService.price) : '' },
            { label: 'Name',         value: details.fullName },
            { label: 'Email',        value: details.email },
            { label: 'Phone',        value: details.phone },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-luxury-border last:border-0">
              <span className="text-sm text-gray-400">{item.label}</span>
              <span className="text-sm font-semibold text-white">{item.value ?? '—'}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">Free cancellation up to 24h before your appointment.</p>
      </div>
    )
  }

  const StepSuccess = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
      <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-8">
        <CheckCircle size={48} className="text-green-400" />
      </div>
      <h2 className="font-serif text-3xl font-bold text-white mb-3">Booking Confirmed!</h2>
      <p className="text-gray-400 mb-2">Reference: <span className="text-gold-400 font-bold">#{bookingId}</span></p>
      <p className="text-gray-400 mb-8">A confirmation has been sent to your email.</p>
      <div className="card-luxury p-6 max-w-sm mx-auto mb-8 text-left space-y-3">
        {[
          { icon: Scissors,  val: selectedService?.name },
          { icon: User,      val: selectedProfessional?.user.fullName },
          { icon: Calendar,  val: selectedDate?.toLocaleDateString() },
          { icon: Clock,     val: selectedTime },
        ].map(({ icon: Icon, val }) => val ? (
          <div key={val} className="flex items-center gap-3 text-sm">
            <Icon size={16} className="text-gold-400" />
            <span className="text-white">{val}</span>
          </div>
        ) : null)}
      </div>
      <button
        onClick={() => { setStep(0); setSelectedService(null); setSelectedProfessional(null); setSelectedDate(null); setSelectedTime(null) }}
        className="btn-gold px-8 py-3">
        Book Another Appointment
      </button>
    </motion.div>
  )

  const showStep = () => {
    switch(step) {
      case 0: return <StepService />
      case 1: return <StepProfessional />
      case 2: return <StepDateTime />
      case 3: return <StepDetails />
      case 4: return <StepConfirm />
      case 5: return <StepSuccess />
      default: return null
    }
  }

  const canProceed = () => {
    if (step === 0) return !!selectedService
    if (step === 1) return !!selectedProfessional
    if (step === 2) return !!selectedDate && !!selectedTime
    return true
  }

  return (
    <div className="min-h-screen bg-luxury-black pt-20">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="gold-line mx-auto mb-4" />
          <h1 className="section-title">Book an <span className="gold-shimmer">Appointment</span></h1>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {step < 5 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                      i < step  ? 'bg-gradient-gold text-luxury-black' :
                      i === step ? 'border-2 border-gold-500 text-gold-400' :
                                   'border border-luxury-border text-gray-500')}>
                      {i < step ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <span className={cn('text-xs hidden sm:block', i === step ? 'text-gold-400 font-semibold' : 'text-gray-500')}>{s}</span>
                    {i < STEPS.length - 1 && <div className={cn('h-px flex-1 min-w-[20px] sm:min-w-[40px] mx-1 transition-colors', i < step ? 'bg-gold-500' : 'bg-luxury-border')} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              {showStep()}
            </motion.div>
          </AnimatePresence>

          {step > 0 && step < 5 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-luxury-border">
              <button onClick={() => setStep(s => s - 1)} className="btn-ghost flex items-center gap-2">
                <ChevronLeft size={16} /> Back
              </button>
              {step < 4 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
                  className={cn('btn-gold', !canProceed() && 'opacity-40 cursor-not-allowed')}>
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit(onConfirm)} disabled={isSubmitting} className="btn-gold">
                  {isSubmitting ? <><div className="luxury-loader !w-4 !h-4 !border-2" /> Processing…</> : <><CheckCircle size={16} /> Confirm Booking</>}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
