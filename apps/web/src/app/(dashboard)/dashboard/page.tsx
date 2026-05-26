'use client'

import useSWR from 'swr'
import { motion } from 'framer-motion'
import {
  Calendar, DollarSign, Users, Star,
  Clock, TrendingUp, ArrowUp, ArrowDown,
  CheckCircle, AlertCircle, Scissors,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/contexts/AuthContext'
import { formatPrice, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => api.get(url).then(r => r.data)

/* ── mock data for demo ──────────────────────── */
const CHART_DATA = [
  { month: 'Jan', earnings: 1200, bookings: 48 },
  { month: 'Feb', earnings: 1800, bookings: 62 },
  { month: 'Mar', earnings: 1400, bookings: 55 },
  { month: 'Apr', earnings: 2200, bookings: 78 },
  { month: 'May', earnings: 2600, bookings: 91 },
  { month: 'Jun', earnings: 3100, bookings: 105 },
]

const UPCOMING_BOOKINGS = [
  { id: '1', client: 'Aisha K.',     service: 'Box Braids',    time: '10:00',  date: 'Today',    status: 'confirmed' },
  { id: '2', client: 'Tomas P.',     service: 'Fade & Taper',  time: '12:00',  date: 'Today',    status: 'confirmed' },
  { id: '3', client: 'Elena S.',     service: 'Haircut',       time: '14:30',  date: 'Today',    status: 'pending'   },
  { id: '4', client: 'Kofi M.',      service: 'Beard Trim',    time: '09:00',  date: 'Tomorrow', status: 'confirmed' },
  { id: '5', client: 'Fatou D.',     service: 'Wig Install',   time: '11:00',  date: 'Tomorrow', status: 'confirmed' },
]

const RECENT_REVIEWS = [
  { client: 'Aisha K.',  rating: 5, comment: 'Best braider in Vilnius! Absolutely love my box braids.', date: '2 days ago' },
  { client: 'Elena S.',  rating: 5, comment: 'Incredible work on my hair coloring. Highly recommend!', date: '3 days ago' },
  { client: 'Tomas P.',  rating: 4, comment: 'Great fade, very professional. Will definitely return.', date: '1 week ago' },
]

const STAT_CARDS = (t: { monthly: number; weeklyChange: number; total: number; rating: number }) => [
  {
    title: 'Monthly Earnings',
    value: formatPrice(t.monthly),
    change: '+12%',
    positive: true,
    icon: DollarSign,
    color: 'text-gold-400',
    bg: 'bg-gold-500/10',
  },
  {
    title: 'Bookings This Month',
    value: '91',
    change: '+18%',
    positive: true,
    icon: Calendar,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Active Clients',
    value: t.total.toString(),
    change: '+8',
    positive: true,
    icon: Users,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Average Rating',
    value: t.rating.toFixed(1),
    change: '+0.2',
    positive: true,
    icon: Star,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  // const { data } = useSWR('/dashboard/stats', fetcher)

  const stats = { monthly: 3100, weeklyChange: 12, total: 147, rating: 4.9 }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">
            Welcome back, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your bookings today.</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/dashboard/availability" className="btn-outline-gold text-sm py-2 px-4 hidden sm:flex">
            <Clock size={14} /> Set Availability
          </a>
          <a href="/book" className="btn-gold text-sm py-2 px-4 hidden sm:flex">
            <Scissors size={14} /> View Profile
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STAT_CARDS(stats).map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <span className={cn(
                'text-xs font-semibold flex items-center gap-0.5',
                stat.positive ? 'text-green-400' : 'text-red-400',
              )}>
                {stat.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts + Upcoming */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-luxury p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Earnings Overview</h3>
              <p className="text-xs text-gray-400">Last 6 months</p>
            </div>
            <TrendingUp size={18} className="text-gold-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="month" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
              <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 12 }} tickFormatter={v => `€${v}`} />
              <Tooltip
                contentStyle={{ background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '12px', color: '#fff' }}
                formatter={(v: number) => [`€${v}`, 'Earnings']}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#D4AF37"
                strokeWidth={2}
                fill="url(#goldGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-luxury p-6"
        >
          <h3 className="font-semibold text-white mb-4">Today's Stats</h3>
          <div className="space-y-4">
            {[
              { label: 'Appointments', value: '5', icon: Calendar,    color: 'text-blue-400' },
              { label: 'Completed',    value: '2', icon: CheckCircle, color: 'text-green-400' },
              { label: "Today's Earn", value: '€145', icon: DollarSign, color: 'text-gold-400' },
              { label: 'Pending',      value: '1', icon: AlertCircle, color: 'text-yellow-400' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <s.icon size={16} className={s.color} />
                  <span className="text-sm text-gray-400">{s.label}</span>
                </div>
                <span className="font-bold text-white">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Rental status */}
          <div className="mt-6 pt-4 border-t border-luxury-border">
            <h4 className="text-sm font-semibold text-white mb-3">Rental Status</h4>
            <div className="glass-gold rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Plan</span>
                <span className="badge-gold text-xs">Monthly</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">Spot #</span>
                <span className="text-xs text-white font-semibold">A-07</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Renews</span>
                <span className="text-xs text-white">Jun 30, 2026</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-luxury"
      >
        <div className="flex items-center justify-between p-6 border-b border-luxury-border">
          <h3 className="font-semibold text-white">Upcoming Bookings</h3>
          <a href="/dashboard/bookings" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {UPCOMING_BOOKINGS.map(b => (
                <tr key={b.id}>
                  <td className="font-medium text-white">{b.client}</td>
                  <td className="text-gray-400">{b.service}</td>
                  <td className="text-gray-400">{b.date}</td>
                  <td className="text-gray-400">{b.time}</td>
                  <td>
                    <span className={b.status === 'confirmed' ? 'badge-success' : 'badge-warning'}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <button className="text-xs text-gold-400 hover:text-gold-300">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-luxury p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">Recent Reviews</h3>
          <a href="/dashboard/reviews" className="text-xs text-gold-400 hover:text-gold-300">View all</a>
        </div>
        <div className="space-y-4">
          {RECENT_REVIEWS.map((r, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-luxury-surface/50">
              <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center
                              text-luxury-black font-bold text-sm flex-shrink-0">
                {r.client.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">{r.client}</span>
                  <span className="text-xs text-gray-500">{r.date}</span>
                </div>
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={11} className="text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-400">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
