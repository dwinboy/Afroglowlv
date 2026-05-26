'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Search, Eye, EyeOff } from 'lucide-react'
import { api } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'

interface Review {
  id:         string
  rating:     number
  comment:    string
  clientName: string
  isVisible:  boolean
  createdAt:  string
  professional?: { user: { fullName: string } }
  service?:     { name: string }
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={13} className={i < rating ? 'fill-gold-400 text-gold-400' : 'text-gray-600'} />
      ))}
    </div>
  )
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => { fetchReviews() }, [search])

  async function fetchReviews() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (search) params.set('search', search)
      const { data } = await api.get(`/reviews?${params}`)
      setReviews(data.data ?? data)
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  async function toggleVisibility(id: string, current: boolean) {
    try {
      await api.patch(`/reviews/${id}/visibility`)
      toast.success(current ? 'Review hidden' : 'Review published')
      setReviews(r => r.map(rev => rev.id === id ? { ...rev, isVisible: !current } : rev))
    } catch {
      toast.error('Failed to update review')
    }
  }

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'
  const visible = reviews.filter(r => r.isVisible).length

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Reviews</h1>
          <p className="text-gray-400 text-sm mt-1">{visible} published · avg {avg} ★</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search reviews…" className="input-luxury pl-9 w-full" />
      </div>

      {loading ? (
        <div className="p-16 text-center"><div className="luxury-loader mx-auto" /></div>
      ) : reviews.length === 0 ? (
        <div className="card-luxury p-16 text-center text-gray-400">
          <Star size={40} className="mx-auto mb-3 opacity-30" />
          <p>No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <motion.div key={r.id} layout
              className={`card-luxury p-4 flex items-start gap-4 ${!r.isVisible ? 'opacity-50' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center
                              text-luxury-black font-bold text-sm flex-shrink-0">
                {r.clientName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-semibold text-white">{r.clientName}</p>
                  <Stars rating={r.rating} />
                  <span className="text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {r.professional && (
                  <p className="text-xs text-gold-400 mb-1">→ {r.professional.user.fullName}{r.service && ` · ${r.service.name}`}</p>
                )}
                <p className="text-sm text-gray-300 leading-relaxed">{r.comment}</p>
              </div>
              <button onClick={() => toggleVisibility(r.id, r.isVisible)}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                  r.isVisible ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-500 hover:text-green-400 hover:bg-green-500/10'
                }`}
                title={r.isVisible ? 'Hide review' : 'Publish review'}>
                {r.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
