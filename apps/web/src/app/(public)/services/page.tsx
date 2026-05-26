'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, ChevronRight, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/contexts/AuthContext'

interface Service {
  id: string; name: string; category: string; price: number
  duration: number; icon: string | null; description: string | null; isPopular: boolean
}

export default function ServicesPage() {
  const [services,       setServices]       = useState<Service[]>([])
  const [loading,        setLoading]        = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    api.get('/services').then(({ data }) => {
      setServices(Array.isArray(data) ? data : [])
    }).catch(() => setServices([])).finally(() => setLoading(false))
  }, [])

  // Build category tabs dynamically from loaded services
  const categories = ['All', ...Array.from(new Set(services.map(s => s.category))).sort()]

  const filtered = activeCategory === 'All'
    ? services
    : services.filter(s => s.category === activeCategory)

  return (
    <div className="min-h-screen bg-luxury-black pt-20">

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex justify-center mb-4"><div className="gold-line" /></div>
            <h1 className="section-title mb-6">Our <span className="gold-shimmer">Services</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Premium hair & beauty services delivered by verified experts.
              All services include a complimentary consultation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      {!loading && categories.length > 1 && (
        <section className="py-12 bg-luxury-charcoal/30 sticky top-16 z-40 border-b border-luxury-border backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3 justify-center">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={cn('px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    activeCategory === cat
                      ? 'bg-gradient-gold text-luxury-black shadow-gold'
                      : 'border border-luxury-border text-gray-400 hover:border-gold-500/30 hover:text-gold-400')}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader size={36} className="text-gold-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">No services available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((service, i) => (
                <motion.div key={service.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="card-luxury p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{service.icon ?? '✂️'}</span>
                    <div className="flex flex-col items-end gap-1">
                      {service.isPopular && <span className="badge-gold text-xs">Popular</span>}
                      <span className="text-lg font-bold text-gradient-gold">€{service.price}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-4">
                    {service.description ?? `Book a ${service.name} with one of our professionals.`}
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-luxury-border">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock size={13} className="text-gold-400" />
                      {service.duration} min
                    </div>
                    <Link href={`/book?service=${encodeURIComponent(service.name)}`}
                      className="ml-auto btn-gold text-xs py-1.5 px-4">
                      Book <ChevronRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-luxury-charcoal/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-6">Can't Find What You Need?</h2>
          <p className="text-gray-400 mb-8">
            Contact us and we'll connect you with the perfect professional for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="btn-gold text-base px-8 py-4">Book a Consultation</Link>
            <Link href="/professionals" className="btn-outline-gold text-base px-8 py-4">Browse Professionals</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
