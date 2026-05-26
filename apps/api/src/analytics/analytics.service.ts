import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [
      totalUsers,
      activeBarbers,
      totalBookings,
      totalSpots,
      occupiedSpots,
      pendingApplications,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'BARBER', isActive: true } }),
      this.prisma.booking.count(),
      this.prisma.rentalSpot.count(),
      this.prisma.rentalSpot.count({ where: { isAvailable: false } }),
      this.prisma.rentalApplication.count({ where: { status: 'PENDING' } }),
    ])

    const today = new Date().toISOString().split('T')[0]
    const todayBookings = await this.prisma.booking.count({
      where: { date: today, status: { in: ['CONFIRMED', 'IN_PROGRESS'] } },
    })

    return {
      totalUsers,
      activeBarbers,
      totalBookings,
      todayBookings,
      totalSpots,
      occupiedSpots,
      availableSpots: totalSpots - occupiedSpots,
      occupancyRate:  totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0,
      pendingApplications,
    }
  }

  async getRevenue(period: string) {
    // In production, aggregate from payments table & bookings
    // This returns mock structured data for the charts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()

    return months.slice(0, currentMonth + 1).map((month, i) => ({
      month,
      revenue:  8000 + Math.floor(Math.random() * 15000),
      bookings: 300  + Math.floor(Math.random() * 500),
    }))
  }

  async getBookings(period: string) {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return this.prisma.booking.groupBy({
      by:     ['status'],
      _count: { _all: true },
    })
  }

  async getOccupancy() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    return days.map(day => ({
      day,
      rate: 55 + Math.floor(Math.random() * 45),
    }))
  }

  async getTopProfessionals(limit: number) {
    return this.prisma.professional.findMany({
      take:    limit,
      orderBy: { reviewCount: 'desc' },
      include: {
        user: { select: { fullName: true, avatarUrl: true, email: true } },
        _count: { select: { bookings: true } },
      },
    })
  }

  async getServiceDistribution() {
    return this.prisma.service.findMany({
      include: {
        _count: { select: { bookings: true } },
      },
      orderBy: { bookings: { _count: 'desc' } },
      take: 10,
    })
  }
}
