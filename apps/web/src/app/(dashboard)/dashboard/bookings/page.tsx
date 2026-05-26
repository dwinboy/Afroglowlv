'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Scissors, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react'
import { api } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { formatPrice } from '@/lib/utils'

interface Booking {
  id:          string
  clientName?: string
  guestName?:  string
  guestEmail?: string
  date:        string
  time:        string
  status:      string
  totalPrice:  number
  notes?:      string
  service?:    { name: string; duration: number }
}

const STATUS_CFG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  CONFIRMED: { label: 'Confirmed', color: 'text-green-400 bg-green-400/10',  icon: CheckCircle },
  PENDING:   { label: 'Pending',   color: 'text-yellow-400 bg-yellow-400/10',icon: AlertCircle },
  COMPLETED: { label: 'Completed', color: 'text-blue-400 bg-blue-400/10',   icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10',     icon: XCircle     },
  NO_SHOW:   { label: 'No Show',   color: 'text-gray-400 bg-gray-400/10',   icon: XCircle     },
}

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading]   = useState(true)
  const [status, setStatus]     = useState('')
  const [tab, setTab]           = useState<'upcoming' | 'all'>('upcoming')

  useEffect(() => { fetchBookings() }, [status])

  async function fetchBookings() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (status) params.set('status', status)
      const { data } = await api.get(`/bookings?${params}`)
      setBookings(data.data ?? data)
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus })
      toast.success(`Booking ${newStatus.toLowerCase()}`)
      fetchBookings()
    } catch {
      toast.error('Failed to update booking')
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const shown = tab === 'upcoming'
    ? bookings.filter(b => b.date >= today && b.status !== 'CANCELLED')
    : bookings

  const todayCount  = bookings.filter(b => b.date === today && b.status !== 'CANCELLED').length
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">My Bookings</h1>
        <p className="text-gray-400 text-sm mt-1">
          {todayCount} today · {pendingCount > 0 && <span className="text-yellow-400">{pendingCount} pending confirmation</span>}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Today',     value: todayCount,                                              color: 'text-gold-400'  },
          { label: 'Pending',   value: pendingCount,                                             color: 'text-yellow-400'},
          { label: 'This Month',value: bookings.filter(b => b.date?.startsWith(today.slice(0,7))).length, color: 'text-white' },
          { label: 'Completed', value: bookings.filter(b => b.status === 'COMPLETED').length,   color: 'text-blue-400'  },
        ].map(c => (
          <div key={c.label} className="card-luxury p-4">
            <p className="text-xs text-gray-400">{c.label}</p>
            <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs + filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-luxury-surface rounded-xl">
          {(['upcoming', 'all'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize
                ${tab === t ? 'bg-gold-500/20 text-gold-400' : 'text-gray-400 hover:text-white'}`}>
              {t === 'upcoming' ? 'Upcoming' : 'All'}
            </button>
          ))}
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={status} onChange={e => setStatus(e.target.value)} className="input-luxury pl-8 text-sm">
            <option value="">All statuses</option>
            {Object.entries(STATUS_CFG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings list */}
      {loading ? (
        <div className="p-16 text-center"><div className="luxury-loader mx-auto" /></div>
      ) : shown.length === 0 ? (
        <div className="card-luxury p-16 text-center text-gray-400">
          <Calendar size={40} className="mx-auto mb-3 opacity-30" />
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map(b => {
            const cfg = STATUS_CFG[b.status] ?? STATUS_CFG.PENDING
            const Icon = cfg.icon
            const name = b.guestName ?? b.clientName ?? 'Guest'
            const isToday = b.date === today
            return (
              <motion.div key={b.id} layout
                className={`card-luxury p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
                  isToday ? 'border border-gold-500/20' : ''
                }`}>
                {/* Date badge */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center
                  ${isToday ? 'bg-gradient-gold text-luxury-black' : 'bg-luxury-surface text-white'}`}>
                  <span className="text-xs font-semibold uppercase">
                    {new Date(b.date).toLocaleDateString('en-GB', { month: 'short' })}
                  </span>
                  <span className="text-xl font-bold leading-none">
                    {new Date(b.date).getDate()}
                  </span>
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-gold-400" />
                    <p className="text-white font-semibold text-sm">{name}</p>
                    {isToday && <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400">Today</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    {b.service && (
                      <span className="flex items-center gap-1">
                        <Scissors size={11} /> {b.service.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {b.time}{b.service?.duration && ` · ${b.service.duration}min`}
                    </span>
                    <span className="text-white font-medium">{formatPrice(b.totalPrice)}</span>
                  </div>
                  {b.notes && <p className="text-xs text-gray-500 mt-1 truncate">{b.notes}</p>}
                  {b.guestEmail && <p className="text-xs text-gray-500">{b.guestEmail}</p>}
                </div>

                {/* Status + actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                    <Icon size={11} /> {cfg.label}
                  </span>
                  {b.status === 'PENDING' && (
                    <>
                      <button onClick={() => updateStatus(b.id, 'CONFIRMED')}
                        className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20">
                        Confirm
                      </button>
                      <button onClick={() => updateStatus(b.id, 'CANCELLED')}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                        Cancel
                      </button>
                    </>
                  )}
                  {b.status === 'CONFIRMED' && b.date === today && (
                    <button onClick={() => updateStatus(b.id, 'COMPLETED')}
                      className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                      Complete
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
