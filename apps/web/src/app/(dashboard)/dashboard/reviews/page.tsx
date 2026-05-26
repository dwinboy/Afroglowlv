'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { api } from '@/contexts/AuthContext'

interface Review { id: string; rating: number; comment: string; author?: { fullName: string }; createdAt: string }

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={13} className={i < rating ? 'fill-gold-400 text-gold-400' : 'text-gray-600'} />
      ))}
    </div>
  )
}

export default function DashboardReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [pro, setPro]         = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/professionals/me').then(({ data }) => {
      setPro(data)
      if (data?.id) {
        api.get(`/reviews/professional/${data.id}`).then(({ data: r }) => setReviews(r.data ?? [])).catch(() => {})
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">My Reviews</h1>
        <p className="text-gray-400 text-sm mt-1">{reviews.length} reviews · avg {avg} ★</p>
      </div>

      {loading ? (
        <div className="p-16 text-center"><div className="luxury-loader mx-auto" /></div>
      ) : reviews.length === 0 ? (
        <div className="card-luxury p-16 text-center text-gray-400">
          <Star size={40} className="mx-auto mb-3 opacity-30" />
          <p>No reviews yet. Complete bookings to receive reviews from clients.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="card-luxury p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-luxury-black font-bold text-xs">
                  {r.author?.fullName?.charAt(0)?.toUpperCase() ?? 'G'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{r.author?.fullName ?? 'Guest'}</p>
                  <Stars rating={r.rating} />
                </div>
                <span className="ml-auto text-xs text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
