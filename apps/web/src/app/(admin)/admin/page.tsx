'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Users, Calendar, DollarSign, MapPin,
  TrendingUp, ArrowUp, AlertCircle, CheckCircle,
  Clock, Star, UserCheck, UserX, FileText,
  BarChart2, Activity,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

/* ── mock analytics data ─────────────────────── */
const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 8400,  bookings: 312 },
  { month: 'Feb', revenue: 11200, bookings: 389 },
  { month: 'Mar', revenue: 9800,  bookings: 344 },
  { month: 'Apr', revenue: 14600, bookings: 521 },
  { month: 'May', revenue: 17200, bookings: 612 },
  { month: 'Jun', revenue: 21000, bookings: 748 },
]

const OCCUPANCY_DATA = [
  { day: 'Mon', rate: 78 },
  { day: 'Tue', rate: 65 },
  { day: 'Wed', rate: 82 },
  { day: 'Thu', rate: 90 },
  { day: 'Fri', rate: 95 },
  { day: 'Sat', rate: 100 },
  { day: 'Sun', rate: 55 },
]

const SERVICE_DIST = [
  { name: 'Haircut',    value: 35, color: '#D4AF37' },
  { name: 'Braids',     value: 28, color: '#F4CF53' },
  { name: 'Dreadlocks', value: 15, color: '#C19B26' },
  { name: 'Color',      value: 12, color: '#A87D1A' },
  { name: 'Other',      value: 10, color: '#2A2A2A' },
]

const RECENT_APPLICATIONS = [
  { name: 'Kwame Asante',  role: 'Barber',    date: '2h ago',   status: 'pending'  },
  { name: 'Bianca Russo',  role: 'Colorist',  date: '5h ago',   status: 'approved' },
  { name: 'Ismail Diop',   role: 'Loctician', date: '1 day ago',status: 'pending'  },
  { name: 'Sonia Park',    role: 'Stylist',   date: '2 days ago',status: 'rejected' },
]

const RECENT_BOOKINGS = [
  { client: 'Aisha K.', pro: 'Marcus J.',  service: 'Fade', amount: '€25', status: 'confirmed', time: '10:00' },
  { client: 'Tomas P.', pro: 'Ama O.',     service: 'Braids', amount: '€80', status: 'confirmed', time: '09:00' },
  { client: 'Elena S.', pro: 'Zara W.',    service: 'Color', amount: '€60', status: 'completed', time: '11:00' },
  { client: 'Kofi M.',   pro: 'Marcus J.', service: 'Beard', amount: '€12', status: 'pending',   time: '14:00' },
  { client: 'Fatou D.',  pro: 'James O.',  service: 'Locs',  amount: '€60', status: 'confirmed', time: '13:00' },
]

const TOP_PROFESSIONALS = [
  { name: 'Zara Williams',  role: 'Colorist',  bookings: 421, revenue: '€21.4k', rating: 4.9 },
  { name: 'Marcus Johnson', role: 'Barber',    bookings: 312, revenue: '€7.8k',  rating: 4.9 },
  { name: 'Ama Osei',       role: 'Braider',   bookings: 284, revenue: '€22.7k', rating: 5.0 },
  { name: 'James Okafor',   role: 'Loctician', bookings: 196, revenue: '€17.6k', rating: 4.8 },
]

const ADMIN_STATS = [
  { title: 'Total Revenue',     value: formatPrice(21000), change: '+22%', icon: DollarSign,  color: 'text-gold-400',   bg: 'bg-gold-500/10'   },
  { title: 'Active Renters',    value: '48',               change: '+3',   icon: Users,       color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
  { title: 'Spots Occupied',    value: '36/40',            change: '90%',  icon: MapPin,      color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { title: 'Monthly Bookings',  value: '748',              change: '+18%', icon: Calendar,    color: 'text-green-400',  bg: 'bg-green-500/10'  },
  { title: 'Avg. Satisfaction', value: '4.9 ★',           change: '+0.1', icon: Star,        color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { title: 'Pending Reviews',   value: '12',               change: 'new',  icon: AlertCircle, color: 'text-red-400',    bg: 'bg-red-500/10'    },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Afroglow platform overview — {new Date().toLocaleDateString('en', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/analytics" className="btn-outline-gold text-sm py-2 px-4 hidden sm:flex">
            <BarChart2 size={14} /> Analytics
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {ADMIN_STATS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card-luxury p-5"
          >
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg)}>
              <s.icon size={17} className={s.color} />
            </div>
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.title}</p>
            <p className="text-[11px] text-green-400 mt-1">{s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-luxury p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Revenue & Bookings</h3>
              <p className="text-xs text-gray-400">Monthly performance</p>
            </div>
            <TrendingUp size={18} className="text-gold-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_REVENUE}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="month" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
              <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fill="url(#revGrad)" name="Revenue (€)" />
              <Area type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} fill="url(#bookGrad)" name="Bookings" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Service Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-luxury p-6"
        >
          <h3 className="font-semibold text-white mb-4">Service Mix</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={SERVICE_DIST}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {SERVICE_DIST.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '12px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {SERVICE_DIST.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-gray-400">{s.name}</span>
                </div>
                <span className="text-white font-semibold">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Occupancy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-luxury p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">Weekly Spot Occupancy</h3>
            <p className="text-xs text-gray-400">Average spot usage by day of week</p>
          </div>
          <Activity size={18} className="text-gold-400" />
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={OCCUPANCY_DATA} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="day" stroke="#555" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis domain={[0, 100]} stroke="#555" tick={{ fill: '#888', fontSize: 12 }} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={{ background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => [`${v}%`, 'Occupancy']} />
            <Bar dataKey="rate" fill="#D4AF37" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-luxury"
        >
          <div className="flex items-center justify-between p-5 border-b border-luxury-border">
            <h3 className="font-semibold text-white">Recent Applications</h3>
            <Link href="/admin/applications" className="text-xs text-gold-400 hover:text-gold-300">View all</Link>
          </div>
          <div className="p-4 space-y-3">
            {RECENT_APPLICATIONS.map((app, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center
                                  text-luxury-black font-bold text-xs flex-shrink-0">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{app.name}</p>
                    <p className="text-xs text-gray-400">{app.role} · {app.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-xs',
                    app.status === 'approved' ? 'badge-success' :
                    app.status === 'rejected' ? 'badge-danger' :
                    'badge-warning',
                  )}>
                    {app.status}
                  </span>
                  {app.status === 'pending' && (
                    <div className="flex gap-1">
                      <button className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30
                                         flex items-center justify-center transition-colors">
                        <CheckCircle size={12} />
                      </button>
                      <button className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30
                                         flex items-center justify-center transition-colors">
                        <UserX size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card-luxury"
        >
          <div className="flex items-center justify-between p-5 border-b border-luxury-border">
            <h3 className="font-semibold text-white">Today's Bookings</h3>
            <Link href="/admin/bookings" className="text-xs text-gold-400 hover:text-gold-300">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table-luxury">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Pro</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_BOOKINGS.map((b, i) => (
                  <tr key={i}>
                    <td>
                      <div>
                        <p className="text-sm text-white">{b.client}</p>
                        <p className="text-xs text-gray-500">{b.time} · {b.service}</p>
                      </div>
                    </td>
                    <td className="text-sm text-gray-400">{b.pro}</td>
                    <td className="font-semibold text-gold-400 text-sm">{b.amount}</td>
                    <td>
                      <span className={cn(
                        b.status === 'confirmed' ? 'badge-success' :
                        b.status === 'completed' ? 'badge-blue' :
                        'badge-warning',
                        'text-xs',
                      )}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Top Professionals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card-luxury"
      >
        <div className="flex items-center justify-between p-5 border-b border-luxury-border">
          <h3 className="font-semibold text-white">Top Performing Professionals</h3>
          <Link href="/admin/users" className="text-xs text-gold-400 hover:text-gold-300">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Professional</th>
                <th>Role</th>
                <th>Bookings</th>
                <th>Revenue</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PROFESSIONALS.map((pro, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center
                                      text-luxury-black font-bold text-xs">
                        {pro.name.charAt(0)}
                      </div>
                      <span className="font-medium text-white text-sm">{pro.name}</span>
                    </div>
                  </td>
                  <td className="text-sm text-gray-400">{pro.role}</td>
                  <td className="font-semibold text-white text-sm">{pro.bookings}</td>
                  <td className="font-semibold text-gold-400 text-sm">{pro.revenue}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-gold-400 fill-gold-400" />
                      <span className="text-sm font-semibold text-white">{pro.rating}</span>
                    </div>
                  </td>
                  <td>
                    <button className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
