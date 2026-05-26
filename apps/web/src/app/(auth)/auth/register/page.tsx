'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/contexts/I18nContext'
import { cn } from '@/lib/utils'

const registerSchema = z.object({
  fullName:        z.string().min(2, 'Full name is required'),
  email:           z.string().email('Please enter a valid email'),
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role:            z.enum(['CUSTOMER', 'BARBER']),
  agreeTerms:      z.boolean().refine(v => v, 'You must agree to the terms'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword]     = useState(false)
  const [showConfirmPw, setShowConfirmPw]   = useState(false)
  const { register: registerUser } = useAuth()
  const { t } = useI18n()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CUSTOMER' },
  })

  const selectedRole = watch('role')

  const onSubmit = async ({ fullName, email, password, role }: RegisterForm) => {
    try {
      await registerUser({ fullName, email, password, role })
      router.push(role === 'BARBER' ? '/dashboard' : '/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg ?? 'Registration failed. Please try again.')
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-white mb-2">{t.auth.registerTitle}</h1>
        <p className="text-gray-400">{t.auth.registerSubtitle}</p>
      </div>

      {/* Role Selection */}
      <div className="mb-6">
        <p className="label-luxury mb-3">I am a…</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'CUSTOMER', label: 'Customer', icon: '🙋', desc: 'Book appointments' },
            { value: 'BARBER',   label: 'Professional', icon: '✂️', desc: 'Rent a spot & work' },
          ].map(r => (
            <label key={r.value} className="cursor-pointer">
              <input
                {...register('role')}
                type="radio"
                value={r.value}
                className="sr-only"
              />
              <div className={cn(
                'rounded-xl border p-4 text-center transition-all duration-200',
                selectedRole === r.value
                  ? 'border-gold-500 bg-gold-500/10 shadow-gold'
                  : 'border-luxury-border hover:border-gold-500/30',
              )}>
                <div className="text-2xl mb-1">{r.icon}</div>
                <div className="text-sm font-semibold text-white">{r.label}</div>
                <div className="text-xs text-gray-400">{r.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="label-luxury">{t.auth.fullName}</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('fullName')}
              className="input-luxury pl-10"
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="label-luxury">{t.auth.email}</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('email')}
              type="email"
              className="input-luxury pl-10"
              placeholder="hello@example.com"
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="label-luxury">{t.auth.password}</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="input-luxury pl-10 pr-10"
              placeholder="Min 8 characters"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="label-luxury">{t.auth.confirmPassword}</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('confirmPassword')}
              type={showConfirmPw ? 'text' : 'password'}
              className="input-luxury pl-10 pr-10"
              placeholder="Repeat password"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3">
          <input
            {...register('agreeTerms')}
            type="checkbox"
            id="terms"
            className="mt-0.5 w-4 h-4 rounded accent-yellow-500 cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer">
            {t.auth.agreeTerms}{' '}
            <Link href="/terms" className="text-gold-400 hover:underline">{t.auth.termsOfService}</Link>
            {' '}{t.auth.and}{' '}
            <Link href="/privacy" className="text-gold-400 hover:underline">{t.auth.privacyPolicy}</Link>
          </label>
        </div>
        {errors.agreeTerms && <p className="text-xs text-red-400">{errors.agreeTerms.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-gold w-full justify-center text-base py-3.5"
        >
          {isSubmitting ? (
            <><div className="luxury-loader !w-5 !h-5 !border-2" /> {t.auth.creatingAccount}</>
          ) : (
            <>Create Account <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        {t.auth.hasAccount}{' '}
        <Link href="/auth/login" className="text-gold-400 hover:text-gold-300 font-semibold">
          {t.auth.signIn}
        </Link>
      </p>
    </motion.div>
  )
}
