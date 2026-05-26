'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import {
  CheckCircle, Clock, Wifi, Star, Shield,
  Users, Award, ArrowRight, Scissors, DollarSign,
  MapPin, RefreshCw,
} from 'lucide-react'
import { cn, API_URL } from '@/lib/utils'
import { api } from '@/contexts/AuthContext'

/* ── schema ──────────────────────────────────── */
const applicationSchema = z.object({
  fullName:        z.string().min(2, 'Full name is required'),
  email:           z.string().email('Valid email required'),
  phone:           z.string().min(8, 'Phone number required'),
  profession:      z.string().min(1, 'Profession is required'),
  yearsExperience: z.string().min(1, 'Experience is required'),
  specialization:  z.string().min(2, 'Specialization required'),
  instagramHandle: z.string().optional(),
  preferredSpot:   z.string().optional(),
  rentalDuration:  z.enum(['daily', 'weekly', 'monthly']),
  startDate:       z.string().min(1, 'Start date required'),
  message:         z.string().min(20, 'Please tell us more about yourself (min 20 chars)'),
  agreeTerms:      z.boolean().refine(v => v, 'You must agree to the terms'),
})

type ApplicationForm = z.infer<typeof applicationSchema>

/* ── static data ──────────────────────────────────── */
const PLANS = [
  {
    id: 'daily',
    name: 'Daily',
    price: 35,
    period: 'per day',
    features: ['8 hours workspace access', 'All equipment included', 'High-speed Wi-Fi', 'Reception support'],
    cta: 'Try It Out',
  },
  {
    id: 'weekly',
    name: 'Weekly',
    price: 180,
    period: 'per week',
    features: ['40 hours access', 'All equipment included', 'Wi-Fi & utilities', 'Marketing support', 'Profile listing'],
    popular: true,
    cta: 'Most Popular',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 600,
    period: 'per month',
    features: ['Unlimited access', 'Dedicated station', 'Full equipment', 'Wi-Fi & utilities', 'Premium marketing', 'Social media promotion', 'Brand package support'],
    cta: 'Best Value',
  },
]

const AMENITIES = [
  { icon: Scissors,   name: 'Premium Equipment' },
  { icon: Wifi,       name: 'High-Speed Wi-Fi' },
  { icon: Users,      name: 'Reception Staff' },
  { icon: Shield,     name: 'Security Cameras' },
  { icon: Star,       name: 'VIP Client Lounge' },
  { icon: Award,      name: 'Marketing Support' },
  { icon: Clock,      name: 'Flexible Hours' },
  { icon: DollarSign, name: 'Payment Processing' },
]

const RULES = [
  'Maintain a clean and tidy workspace at all times',
  'Treat all clients and colleagues with respect',
  'Keep scheduled hours or notify management 24h in advance',
  'No subleasing your spot without management approval',
  'Professional attire required at all times',
  'Comply with all Lithuanian health & safety regulations',
  'Complete background check and certification verification',
]

function formatAvailableFrom(date: string | null | undefined) {
  if (!date) return 'Rental ongoing'
  const d = new Date(date)
  if (d <= new Date()) return 'Available soon'
  return `Available from ${d.toLocaleDateString('en', { month: 'long', year: 'numeric' })}`
}

export default function RentASpotPage() {
  const [selectedPlan,    setSelectedPlan]    = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [isSubmitted,     setIsSubmitted]      = useState(false)
  const [isLoading,       setIsLoading]        = useState(false)
  const [spots,           setSpots]            = useState<any[]>([])
  const [spotsLoading,    setSpotsLoading]     = useState(true)
  const [chosenSpot,      setChosenSpot]       = useState<string>('')

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { rentalDuration: 'weekly' },
  })

  /* fetch live spot availability */
  useEffect(() => {
    axios.get(`${API_URL}/spots`)
      .then(r => setSpots(r.data))
      .catch(() => {})
      .finally(() => setSpotsLoading(false))
  }, [])

  function selectSpot(spotNumber: string) {
    setChosenSpot(spotNumber)
    setValue('preferredSpot', spotNumber)
    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const onSubmit = async (data: ApplicationForm) => {
    setIsLoading(true)
    try {
      await api.post('/rental-applications', data)
      setIsSubmitted(true)
      reset()
      setChosenSpot('')
      toast.success("Application submitted! We'll be in touch within 48 hours.")
    } catch {
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const availableCount = spots.filter(s => s.isAvailable).length

  return (
    <div className="min-h-screen bg-luxury-black pt-20">

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="gold-line mb-6" />
            <h1 className="section-title mb-6">
              Rent Your <span className="gold-shimmer">Working Spot</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join the Afroglow community. Premium workspace, built-in clients, zero overhead stress. Focus on what you do best.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                `${availableCount || 5} Spots Available`,
                '200+ Clients/Month',
                '5★ Rated Workspace',
              ].map(s => (
                <div key={s} className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                  <CheckCircle size={14} className="text-gold-400" />
                  <span className="text-sm text-gray-300">{s}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LIVE SPOT AVAILABILITY ──────────────────────── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-3"><div className="gold-line" /></div>
            <h2 className="section-title">Live Spot Availability</h2>
            <p className="section-subtitle mx-auto">
              All 5 chairs at Afroglow Vilnius — updated in real time
            </p>
          </div>

          {spotsLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw size={28} className="text-gold-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {spots.map((spot, i) => {
                const isAvailable = spot.isAvailable
                const professional = spot.professional
                const tenantName   = professional?.user?.fullName?.split(' ')[0] ?? null
                const endDate      = professional?.rentalEndDate

                return (
                  <motion.div
                    key={spot.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={cn(
                      'relative card-luxury p-6 flex flex-col items-center text-center transition-all',
                      isAvailable
                        ? 'border-green-500/30 hover:border-green-500/60 hover:shadow-[0_0_24px_rgba(34,197,94,0.15)] cursor-pointer'
                        : 'border-red-500/20 opacity-80',
                    )}
                    onClick={() => isAvailable && selectSpot(spot.spotNumber)}
                  >
                    {/* Spot number */}
                    <div className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center mb-4 font-bold text-lg',
                      isAvailable
                        ? 'bg-green-500/15 border border-green-500/30 text-green-300'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400',
                    )}>
                      {spot.spotNumber}
                    </div>

                    {/* Status dot + label */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className={cn(
                        'w-2 h-2 rounded-full',
                        isAvailable ? 'bg-green-400 animate-pulse' : 'bg-red-400',
                      )} />
                      <span className={cn(
                        'text-xs font-semibold uppercase tracking-wide',
                        isAvailable ? 'text-green-400' : 'text-red-400',
                      )}>
                        {isAvailable ? 'Available' : 'Occupied'}
                      </span>
                    </div>

                    {isAvailable ? (
                      <>
                        <p className="text-xs text-gray-400 mb-4">
                          Chair · €35/day<br/>€180/week · €600/mo
                        </p>
                        <div className={cn(
                          'mt-auto text-xs px-3 py-1.5 rounded-lg font-medium transition-colors',
                          chosenSpot === spot.spotNumber
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-white/5 text-gray-400 border border-white/10 group-hover:text-green-400',
                        )}>
                          {chosenSpot === spot.spotNumber ? '✓ Selected' : 'Select spot'}
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-gray-500 space-y-1">
                        {tenantName && (
                          <p className="text-gray-400">
                            Rented by <span className="font-medium text-white">{tenantName}</span>
                          </p>
                        )}
                        <p className={cn(
                          'text-[11px] px-2 py-1 rounded-lg',
                          endDate && new Date(endDate) > new Date()
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'text-gray-600',
                        )}>
                          {formatAvailableFrom(endDate)}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" /> Available — click to pre-select
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" /> Occupied — see when it frees up
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-24 bg-luxury-charcoal/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-3"><div className="gold-line" /></div>
            <h2 className="section-title">Rental Plans</h2>
            <p className="section-subtitle mx-auto">Choose the plan that fits your working style</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn('card-luxury p-8 relative flex flex-col', plan.popular && 'border-gold-500/50 shadow-gold')}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge-gold px-4 py-1.5 text-xs">Most Popular</span>
                  </div>
                )}
                <h3 className="font-serif font-bold text-xl text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-gradient-gold">€{plan.price}</span>
                  <span className="text-sm text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle size={15} className="text-gold-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setSelectedPlan(plan.id as 'daily' | 'weekly' | 'monthly')
                    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={cn(
                    'w-full text-sm py-3 rounded-xl font-semibold transition-all',
                    plan.popular
                      ? 'bg-gradient-gold text-luxury-black hover:shadow-gold-lg'
                      : 'border border-gold-500/30 text-gold-400 hover:bg-gold-500/10',
                  )}
                >
                  {plan.cta} — Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-3"><div className="gold-line" /></div>
            <h2 className="section-title">What's Included</h2>
            <p className="section-subtitle mx-auto">Every spot comes fully equipped</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {AMENITIES.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-luxury p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-3">
                  <a.icon size={20} className="text-gold-400" />
                </div>
                <p className="text-sm font-medium text-white">{a.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-24 bg-luxury-charcoal/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-3"><div className="gold-line" /></div>
            <h2 className="section-title">Studio Rules & Policies</h2>
          </div>
          <div className="card-luxury p-8">
            <ul className="space-y-4">
              {RULES.map((rule, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0 text-luxury-black text-xs font-bold mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-gray-300 text-sm">{rule}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-3"><div className="gold-line" /></div>
            <h2 className="section-title">Apply to Rent a Spot</h2>
            <p className="section-subtitle mx-auto">
              Fill out the form below and our team will review your application within 48 hours.
            </p>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-luxury p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={36} className="text-green-400" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-4">Application Received!</h3>
              <p className="text-gray-400 mb-8">
                Thank you for applying to Afroglow. Our team will review your application and reach out within 48 business hours.
              </p>
              <button onClick={() => setIsSubmitted(false)} className="btn-outline-gold">
                Submit Another Application
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="card-luxury p-8 space-y-6">

              {/* Spot selection notice */}
              {chosenSpot && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <MapPin size={16} className="text-green-400 flex-shrink-0" />
                  <p className="text-sm text-green-300">
                    Spot <span className="font-bold">{chosenSpot}</span> pre-selected. You can change this below.
                  </p>
                </div>
              )}

              {/* Personal Info */}
              <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 flex items-center justify-center text-xs">1</span>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-luxury">Full Name *</label>
                    <input {...register('fullName')} className="input-luxury" placeholder="John Doe" />
                    {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="label-luxury">Email Address *</label>
                    <input {...register('email')} type="email" className="input-luxury" placeholder="john@example.com" />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label-luxury">Phone Number *</label>
                    <input {...register('phone')} className="input-luxury" placeholder="+370 691 50485" />
                    {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="label-luxury">Instagram (optional)</label>
                    <input {...register('instagramHandle')} className="input-luxury" placeholder="@yourhandle" />
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 flex items-center justify-center text-xs">2</span>
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-luxury">Profession *</label>
                    <select {...register('profession')} className="input-luxury">
                      <option value="">Select profession</option>
                      <option value="barber">Barber</option>
                      <option value="hairdresser">Hairdresser</option>
                      <option value="braider">Braider</option>
                      <option value="loctician">Loctician</option>
                      <option value="colorist">Colorist</option>
                      <option value="stylist">Stylist</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.profession && <p className="text-xs text-red-400 mt-1">{errors.profession.message}</p>}
                  </div>
                  <div>
                    <label className="label-luxury">Years of Experience *</label>
                    <select {...register('yearsExperience')} className="input-luxury">
                      <option value="">Select experience</option>
                      <option value="0-1">0–1 years</option>
                      <option value="2-3">2–3 years</option>
                      <option value="4-6">4–6 years</option>
                      <option value="7-10">7–10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                    {errors.yearsExperience && <p className="text-xs text-red-400 mt-1">{errors.yearsExperience.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label-luxury">Specialization *</label>
                    <input
                      {...register('specialization')}
                      className="input-luxury"
                      placeholder="e.g. Afro fades, Box braids, Hair coloring…"
                    />
                    {errors.specialization && <p className="text-xs text-red-400 mt-1">{errors.specialization.message}</p>}
                  </div>
                </div>
              </div>

              {/* Rental Details */}
              <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/30 text-gold-400 flex items-center justify-center text-xs">3</span>
                  Rental Preferences
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-luxury">Rental Duration *</label>
                    <div className="flex gap-3">
                      {PLANS.map(p => (
                        <label key={p.id} className="flex-1">
                          <input
                            {...register('rentalDuration')}
                            type="radio"
                            value={p.id}
                            className="sr-only"
                            onChange={() => setSelectedPlan(p.id as 'daily' | 'weekly' | 'monthly')}
                          />
                          <div className={cn(
                            'cursor-pointer rounded-xl border p-3 text-center text-xs font-medium transition-all',
                            selectedPlan === p.id
                              ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                              : 'border-luxury-border text-gray-400 hover:border-gold-500/30',
                          )}>
                            {p.name}
                            <div className="font-bold">€{p.price}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label-luxury">Preferred Start Date *</label>
                    <input
                      {...register('startDate')}
                      type="date"
                      className="input-luxury"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.startDate && <p className="text-xs text-red-400 mt-1">{errors.startDate.message}</p>}
                  </div>

                  {/* Preferred Spot */}
                  <div className="sm:col-span-2">
                    <label className="label-luxury">
                      Preferred Spot
                      <span className="text-gray-600 ml-1 text-xs">(optional — only available spots shown)</span>
                    </label>
                    <select
                      {...register('preferredSpot')}
                      value={chosenSpot}
                      onChange={e => {
                        setChosenSpot(e.target.value)
                        setValue('preferredSpot', e.target.value)
                      }}
                      className="input-luxury"
                    >
                      <option value="">No preference</option>
                      {spots
                        .filter(s => s.isAvailable)
                        .map(s => (
                          <option key={s.id} value={s.spotNumber}>
                            Spot {s.spotNumber} — Available now
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="label-luxury">Tell Us About Yourself *</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className="input-luxury resize-none"
                  placeholder="Tell us about your experience, your clients, and why you want to join Afroglow…"
                />
                {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  {...register('agreeTerms')}
                  type="checkbox"
                  id="agreeTerms"
                  className="mt-1 w-4 h-4 rounded border-luxury-border bg-luxury-surface checked:accent-gold-500 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-400 cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-gold-400 hover:text-gold-300">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-gold-400 hover:text-gold-300">Privacy Policy</Link>
                </label>
              </div>
              {errors.agreeTerms && <p className="text-xs text-red-400 -mt-3">{errors.agreeTerms.message}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-gold w-full justify-center text-base py-4"
              >
                {isLoading ? (
                  <><div className="luxury-loader !w-5 !h-5 !border-2" /> Submitting…</>
                ) : (
                  <><ArrowRight size={18} /> Submit Application</>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  )
}
