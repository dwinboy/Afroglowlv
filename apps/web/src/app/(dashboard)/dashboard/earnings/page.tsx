'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { api } from '@/contexts/AuthContext'
import { formatPrice } from '@/lib/utils'

export default function DashboardEarningsPage() {
  const [stats, setStats]   = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics/professional/me').then(({ data }) => setStats(data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'This Month',   value: formatPrice(stats?.monthlyRevenue ?? 0),    icon: DollarSign,  color: 'text-gold-400'  },
    { label: 'This Week',    value: formatPrice(stats?.weeklyRevenue  ?? 0),    icon: TrendingUp,  color: 'text-green-400' },
    { label: 'Total Earned', value: formatPrice(stats?.totalRevenue   ?? 0),    icon: DollarSign,  color: 'text-white'     },
    { label: 'Avg / Booking',value: formatPrice(stats?.avgBookingValue ?? 0),   icon: Calendar,    color: 'text-blue-400'  },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Earnings</h1>
        <p className="text-gray-400 text-sm mt-1">Your income overview</p>
      </div>

      {loading ? (
        <div className="p-16 text-center"><div className="luxury-loader mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(c => (
            <div key={c.label} className="card-luxury p-5">
              <div className="flex items-center gap-2 mb-3">
                <c.icon size={16} className={c.color} />
                <span className="text-xs text-gray-400">{c.label}</span>
              </div>
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card-luxury p-8 text-center text-gray-400">
        <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-medium text-white mb-1">Detailed earnings report coming soon</p>
        <p className="text-sm">Monthly breakdown, charts and payout history will appear here.</p>
      </div>
    </motion.div>
  )
}
