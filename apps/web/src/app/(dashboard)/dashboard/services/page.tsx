'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Scissors, Plus, Eye, EyeOff } from 'lucide-react'
import { api } from '@/contexts/AuthContext'
import { formatPrice } from '@/lib/utils'

interface Service { id: string; name: string; category: string; price: number; duration: number; isActive: boolean; icon?: string }

export default function DashboardServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get('/services').then(({ data }) => setServices(Array.isArray(data) ? data : data.data ?? [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Services</h1>
        <p className="text-gray-400 text-sm mt-1">Services you offer to clients</p>
      </div>

      {loading ? (
        <div className="p-16 text-center"><div className="luxury-loader mx-auto" /></div>
      ) : services.length === 0 ? (
        <div className="card-luxury p-16 text-center text-gray-400">
          <Scissors size={40} className="mx-auto mb-3 opacity-30" />
          <p>No services found. Ask admin to assign services to your profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => (
            <div key={s.id} className={`card-luxury p-4 ${!s.isActive ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.icon ?? '✂️'}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.category}</p>
                  </div>
                </div>
                {s.isActive
                  ? <Eye size={14} className="text-green-400 flex-shrink-0 mt-1" />
                  : <EyeOff size={14} className="text-gray-500 flex-shrink-0 mt-1" />
                }
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gold-400 font-bold">{formatPrice(s.price)}</span>
                <span className="text-xs text-gray-400">{s.duration} min</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
