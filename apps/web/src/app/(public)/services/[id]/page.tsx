'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, ChevronLeft, CalendarDays, ArrowRight, Scissors, Tag } from 'lucide-react'
import { ServiceGlyph } from '@/components/icons/ServiceIcons'
import { api } from '@/contexts/AuthContext'
import { useI18n } from '@/contexts/I18nContext'

interface Service {
  id: string
  name: string
  category: string
  price: number
  duration: number
  icon: string | null
  imageUrl: string | null
  description: string | null
  isPopular: boolean
}

/* Keyword → stock image fallback, used only when a service has no imageUrl set. */
const SERVICE_VISUALS = [
  { keywords: ['beard', 'trim', 'shave', 'barzd'], src: '/images/haircuts/beard-fade.jpg' },
  { keywords: ['design', 'line', 'fade', 'kontūr'], src: '/images/haircuts/design-beard.jpg' },
  { keywords: ['haircut', 'kids', 'cut', 'kirp'], src: '/images/haircuts/crisp-lineup.jpeg' },
  { keywords: ['braid', 'loc', 'dread', 'pyn', 'twist'], src: '/images/haircuts/high-top-fade-chair.avif' },
]

function fallbackVisual(s: Service) {
  const hay = `${s.name} ${s.category} ${s.description ?? ''}`.toLowerCase()
  return SERVICE_VISUALS.find(v => v.keywords.some(k => hay.includes(k)))?.src ?? '/images/haircuts/black-hair-barber-1.jpg'
}

const COPY = {
  en: {
    back: 'All services',
    popular: 'Popular',
    duration: 'Duration',
    min: 'min',
    from: 'from',
    book: 'Book this service',
    browsePros: 'Browse professionals',
    fallback: (name: string) => `Book ${name} with one of our verified professionals at Afroglow.`,
    notFound: 'Service not found',
    notFoundText: 'This service may have been removed or is no longer available.',
    backToServices: 'Back to services',
    includes: 'Every booking includes a complimentary consultation with your professional.',
  },
  lt: {
    back: 'Visos paslaugos',
    popular: 'Populiaru',
    duration: 'Trukmė',
    min: 'min.',
    from: 'nuo',
    book: 'Rezervuoti šią paslaugą',
    browsePros: 'Peržiūrėti specialistus',
    fallback: (name: string) => `Rezervuokite „${name}“ pas vieną iš patikrintų Afroglow specialistų.`,
    notFound: 'Paslauga nerasta',
    notFoundText: 'Ši paslauga galėjo būti pašalinta arba nebeteikiama.',
    backToServices: 'Grįžti į paslaugas',
    includes: 'Kiekviena rezervacija apima nemokamą konsultaciją su specialistu.',
  },
} as const

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { locale } = useI18n()
  const copy = COPY[locale]

  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed]   = useState(false)

  useEffect(() => {
    if (!id) return
    let mounted = true
    setLoading(true)
    api.get<Service>(`/services/${id}`)
      .then(({ data }) => { if (mounted) setService(data) })
      .catch(() => { if (mounted) setFailed(true) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  return (
    <div className="min-h-screen bg-luxury-black pt-20">
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gold-400 transition-colors mb-8">
            <ChevronLeft size={16} /> {copy.back}
          </Link>

          {loading ? (
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div className="skeleton-luxury aspect-[4/3] rounded-2xl" />
              <div className="space-y-5 pt-4">
                <div className="skeleton-luxury h-6 w-24" />
                <div className="skeleton-luxury h-10 w-2/3" />
                <div className="skeleton-luxury h-4 w-full" />
                <div className="skeleton-luxury h-4 w-4/5" />
                <div className="skeleton-luxury h-12 w-48" />
              </div>
            </div>
          ) : failed || !service ? (
            <div className="card-luxury mx-auto max-w-xl p-12 text-center">
              <Scissors size={34} className="mx-auto mb-4 text-gold-400" />
              <h1 className="font-serif text-2xl font-bold text-white mb-2">{copy.notFound}</h1>
              <p className="text-sm text-gray-400 mb-6">{copy.notFoundText}</p>
              <Link href="/services" className="btn-outline-gold">{copy.backToServices}</Link>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start"
            >
              {/* Image */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gold-500/10 blur-3xl rounded-full" aria-hidden />
                <div className="relative rounded-2xl overflow-hidden border border-luxury-border shadow-luxury aspect-[4/3] bg-luxury-charcoal">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.imageUrl || fallbackVisual(service)}
                    alt={service.name}
                    className="w-full h-full object-cover grade-warm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/30 bg-black/40 backdrop-blur-md text-gold-400">
                    <ServiceGlyph icon={service.icon} size={24} />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 badge-gold text-xs">
                    <Tag size={11} /> {service.category}
                  </span>
                  {service.isPopular && <span className="badge-gold text-xs">{copy.popular}</span>}
                </div>

                <h1 className="section-title mb-5">{service.name}</h1>

                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {service.description?.trim() || copy.fallback(service.name)}
                </p>

                {/* Price + duration */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="card-luxury px-5 py-4">
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{copy.from}</p>
                    <p className="text-2xl font-bold text-gradient-gold">€{service.price}</p>
                  </div>
                  <div className="card-luxury px-5 py-4">
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{copy.duration}</p>
                    <p className="text-2xl font-bold text-white flex items-center gap-2">
                      <Clock size={18} className="text-gold-400" /> {service.duration} {copy.min}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={`/book?service=${service.id}`} className="btn-gold text-base px-8 py-4">
                    <CalendarDays size={18} /> {copy.book}
                  </Link>
                  <Link href="/professionals" className="btn-outline-gold text-base px-8 py-4">
                    {copy.browsePros} <ArrowRight size={18} />
                  </Link>
                </div>

                <p className="text-xs text-gray-500 mt-6">{copy.includes}</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
