import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Afroglow database…')

  // ── Admin user ─────────────────────────────────────
  const adminPw = await bcrypt.hash('Admin@2024!', 12)
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@afroglow.lt' },
    update: {},
    create: {
      email:        'admin@afroglow.lt',
      fullName:     'Afroglow Admin',
      passwordHash: adminPw,
      role:         'ADMIN',
      isVerified:   true,
      isActive:     true,
    },
  })
  console.log(`✅ Admin created: ${admin.email}`)

  // ── Default branch ──────────────────────────────────
  const branch = await prisma.branch.upsert({
    where:  { id: 'main-branch' },
    update: {
      phone: '+37069150485',
      email: 'afroglowstudiostudio@gmail.com',
    },
    create: {
      id:      'main-branch',
      name:    'Afroglow Vilnius',
      address: 'Kalvarijų g. 88',
      city:    'Vilnius',
      country: 'Lithuania',
      phone:   '+37069150485',
      email:   'afroglowstudiostudio@gmail.com',
      isActive:true,
      openingHours: {
        monday:    { open: '09:00', close: '21:00' },
        tuesday:   { open: '09:00', close: '21:00' },
        wednesday: { open: '09:00', close: '21:00' },
        thursday:  { open: '09:00', close: '21:00' },
        friday:    { open: '09:00', close: '21:00' },
        saturday:  { open: '09:00', close: '19:00' },
        sunday:    { open: '10:00', close: '17:00' },
      },
    },
  })
  console.log(`✅ Branch created: ${branch.name}`)

  // ── Default services ────────────────────────────────
  const services = [
    { name: 'Classic Haircut',       category: 'Hair',         price: 15,  duration: 45,  icon: '✂️',  isPopular: false },
    { name: 'Fade & Taper',          category: 'Hair',         price: 25,  duration: 60,  icon: '💈',  isPopular: true  },
    { name: 'Beard Trim & Shape',    category: 'Beard',        price: 12,  duration: 30,  icon: '🪒',  isPopular: false },
    { name: 'Haircut + Beard',       category: 'Beard',        price: 35,  duration: 90,  icon: '👑',  isPopular: true  },
    { name: 'Box Braids',            category: 'Braids & Locs',price: 80,  duration: 300, icon: '🧵',  isPopular: true  },
    { name: 'Knotless Braids',       category: 'Braids & Locs',price: 100, duration: 360, icon: '🌀',  isPopular: false },
    { name: 'Cornrows',              category: 'Braids & Locs',price: 40,  duration: 120, icon: '💫',  isPopular: false },
    { name: 'Dreadlocks Install',    category: 'Braids & Locs',price: 120, duration: 480, icon: '🔒',  isPopular: false },
    { name: 'Locs Retwist',          category: 'Braids & Locs',price: 60,  duration: 180, icon: '🔧',  isPopular: true  },
    { name: 'Wig Installation',      category: 'Hair',         price: 80,  duration: 120, icon: '👸',  isPopular: false },
    { name: 'Hair Coloring',         category: 'Color',        price: 60,  duration: 180, icon: '🎨',  isPopular: false },
    { name: 'Highlights & Balayage', category: 'Color',        price: 90,  duration: 240, icon: '✨',  isPopular: true  },
    { name: 'Deep Conditioning',     category: 'Treatments',   price: 35,  duration: 60,  icon: '💧',  isPopular: false },
    { name: 'Scalp Treatment',       category: 'Treatments',   price: 40,  duration: 45,  icon: '🌿',  isPopular: false },
    { name: "Kids' Haircut",         category: 'Special',      price: 12,  duration: 30,  icon: '👶',  isPopular: false },
    { name: "Women's Styling",       category: 'Hair',         price: 35,  duration: 75,  icon: '💁',  isPopular: false },
  ]

  let servicesCreated = 0
  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } })
    if (!existing) {
      await prisma.service.create({ data: { ...s, isActive: true } })
      servicesCreated++
    }
  }
  console.log(`✅ ${servicesCreated} services seeded`)

  // ── Rental spots (5 chairs) ─────────────────────────
  const spots = Array.from({ length: 5 }, (_, i) => ({
    spotNumber:  `A-${(i + 1).toString().padStart(2, '0')}`,
    type:        'CHAIR',
    dailyRate:   35,
    weeklyRate:  180,
    monthlyRate: 600,
    isAvailable: true,
    branchId:    branch.id,
  }))

  let spotsCreated = 0
  for (const spot of spots) {
    const existing = await prisma.rentalSpot.findFirst({
      where: { spotNumber: spot.spotNumber, branchId: spot.branchId },
    })
    if (!existing) {
      await prisma.rentalSpot.create({ data: spot })
      spotsCreated++
    }
  }
  console.log(`✅ ${spotsCreated} rental spots seeded`)

  console.log('\n🎉 Afroglow database seeded successfully!')
  console.log('\n📍 Admin credentials:')
  console.log('   Email:    admin@afroglow.lt')
  console.log('   Password: Admin@2024!')
  console.log('\n⚠️  Change admin password immediately in production!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
