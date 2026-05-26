'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Search, Filter, Instagram, ChevronRight, MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const SPECIALITIES = ['All', 'Barber', 'Braider', 'Loctician', 'Colorist', 'Stylist']

const PROFESSIONALS = [
  {
    id: '1',
    name: 'Marcus Johnson',
    role: 'Master Barber',
    speciality: 'Barber',
    rating: 4.9,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1595152452543-e5fc22ef827d?w=400&h=500&fit=crop',
    bio: '10+ years experience specializing in fades, tapers & skin fades. Master of precision cuts.',
    services: ['Classic Haircut', 'Fade & Taper', 'Beard Trim', 'Hot Towel Shave'],
    price: 'from €20',
    instagram: '@marcus.cuts',
    availability: 'Mon-Sat',
    portfolio: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    ],
    verified: true,
  },
  {
    id: '2',
    name: 'Ama Osei',
    role: 'Certified Hair Braider',
    speciality: 'Braider',
    rating: 5.0,
    reviews: 284,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
    bio: 'Specializing in protective styles for all hair types. Box braids, knotless braids & cornrows are my art.',
    services: ['Box Braids', 'Knotless Braids', 'Cornrows', 'Twists'],
    price: 'from €45',
    instagram: '@ama.braids',
    availability: 'Tue-Sun',
    portfolio: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300&h=300&fit=crop',
    ],
    verified: true,
  },
  {
    id: '3',
    name: 'James Okafor',
    role: 'Loctician & Natural Hair Specialist',
    speciality: 'Loctician',
    rating: 4.8,
    reviews: 196,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    bio: 'Expert loctician with 8 years growing and maintaining locs. Your hair journey starts here.',
    services: ['Dreadlocks Installation', 'Locs Retwist', 'Loc Repair', 'Scalp Treatment'],
    price: 'from €60',
    instagram: '@james.locs',
    availability: 'Mon-Fri',
    portfolio: [
      'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1536520002442-39d9adaf3f41?w=300&h=300&fit=crop',
    ],
    verified: true,
  },
  {
    id: '4',
    name: 'Zara Williams',
    role: 'Color Specialist & Stylist',
    speciality: 'Colorist',
    rating: 4.9,
    reviews: 421,
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=500&fit=crop',
    bio: 'Award-winning colorist. I create vibrant, healthy color transformations you\'ll love.',
    services: ['Hair Coloring', 'Highlights & Balayage', "Women's Styling", 'Deep Conditioning'],
    price: 'from €45',
    instagram: '@zara.color',
    availability: 'Wed-Mon',
    portfolio: [
      'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1615397587950-3cbb55f95b91?w=300&h=300&fit=crop',
    ],
    verified: true,
  },
  {
    id: '5',
    name: 'David Mensah',
    role: 'Barber & Stylist',
    speciality: 'Barber',
    rating: 4.7,
    reviews: 148,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
    bio: 'Creative barber serving complex designs and razor art. Book me if you want your hair to stand out.',
    services: ['Fade & Taper', 'Hair Designs', 'Classic Haircut', 'Beard Trim'],
    price: 'from €25',
    instagram: '@david.cuts',
    availability: 'Mon-Sat',
    portfolio: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    ],
    verified: false,
  },
  {
    id: '6',
    name: 'Fatou Diallo',
    role: 'Natural Hair Specialist',
    speciality: 'Stylist',
    rating: 4.8,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop',
    bio: 'Natural hair care expert. Specializing in 4c hair, protective styles, and healthy hair growth.',
    services: ["Women's Styling", 'Deep Conditioning', 'Scalp Treatment', 'Wig Installation'],
    price: 'from €35',
    instagram: '@fatou.naturalhair',
    availability: 'Tue-Sun',
    portfolio: [
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop',
    ],
    verified: true,
  },
]

export default function ProfessionalsPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof PROFESSIONALS[0] | null>(null)

  const filtered = PROFESSIONALS.filter(p => {
    const matchesCat = filter === 'All' || p.speciality === filter
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.services.some(s => s.toLowerCase().includes(search.toLowerCase()))
    return matchesCat && matchesSearch
  })

  return (
    <div className="min-h-screen bg-luxury-black pt-20">

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-center mb-4"><div className="gold-line" /></div>
            <h1 className="section-title mb-6">Our <span className="gold-shimmer">Professionals</span></h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Hand-picked, verified beauty experts ready to make you look and feel your best.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-luxury-charcoal/30 sticky top-16 z-40 border-b border-luxury-border backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or service…"
                className="input-luxury pl-9 text-sm"
              />
            </div>
            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {SPECIALITIES.map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-medium transition-all',
                    filter === s
                      ? 'bg-gradient-gold text-luxury-black'
                      : 'border border-luxury-border text-gray-400 hover:border-gold-500/30 hover:text-gold-400',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-400 mb-8">{filtered.length} professionals found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((pro, i) => (
              <motion.div
                key={pro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card-luxury overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-64">
                  <Image
                    src={pro.image}
                    alt={pro.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {pro.verified && (
                    <div className="absolute top-3 right-3 badge-success text-xs">
                      ✓ Verified
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-white text-lg">{pro.name}</h3>
                        <p className="text-xs text-gold-400">{pro.role}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-black/50 rounded-lg px-2 py-1">
                        <Star size={12} className="text-gold-400 fill-gold-400" />
                        <span className="text-xs text-white font-semibold">{pro.rating}</span>
                        <span className="text-xs text-gray-400">({pro.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{pro.bio}</p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pro.services.slice(0, 3).map(s => (
                      <span key={s} className="text-xs px-2 py-1 rounded-full bg-luxury-muted/50 text-gray-300">
                        {s}
                      </span>
                    ))}
                    {pro.services.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-luxury-muted/50 text-gold-400">
                        +{pro.services.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-luxury-border">
                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={11} /> {pro.availability}
                      </p>
                      <p className="text-sm font-semibold text-gold-400">{pro.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(pro)}
                        className="btn-ghost text-xs py-1.5 px-3"
                      >
                        Profile
                      </button>
                      <Link
                        href={`/book?professional=${pro.id}`}
                        className="btn-gold text-xs py-1.5 px-4"
                      >
                        Book
                      </Link>
                    </div>
                  </div>

                  {/* Mini portfolio */}
                  <div className="flex gap-2 mt-4">
                    {pro.portfolio.slice(0, 3).map((img, j) => (
                      <div key={j} className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={img} alt="Portfolio" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-3xl mb-4">🔍</p>
              <h3 className="text-xl font-semibold text-white mb-2">No professionals found</h3>
              <p className="text-gray-400">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Professional Profile Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-luxury-surface border border-luxury-border rounded-3xl max-w-2xl w-full
                       max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-56">
              <Image src={selected.image} alt={selected.name} fill className="object-cover rounded-t-3xl" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white
                           flex items-center justify-center hover:bg-black/80 transition-colors"
              >×</button>
            </div>
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-white">{selected.name}</h2>
                  <p className="text-gold-400">{selected.role}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Star size={16} className="text-gold-400 fill-gold-400" />
                  <span className="font-bold text-white">{selected.rating}</span>
                  <span className="text-gray-400">({selected.reviews} reviews)</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6">{selected.bio}</p>
              <h4 className="font-semibold text-white mb-3">Services</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {selected.services.map(s => (
                  <span key={s} className="badge-gold text-xs">{s}</span>
                ))}
              </div>
              <h4 className="font-semibold text-white mb-3">Portfolio</h4>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {selected.portfolio.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                    <Image src={img} alt="Portfolio" fill className="object-cover" />
                  </div>
                ))}
              </div>
              <Link
                href={`/book?professional=${selected.id}`}
                className="btn-gold w-full justify-center text-base py-4"
              >
                Book with {selected.name.split(' ')[0]} <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  )
}
