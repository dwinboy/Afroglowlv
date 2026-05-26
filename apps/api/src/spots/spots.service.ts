import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SpotsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(availableOnly = false) {
    return this.prisma.rentalSpot.findMany({
      where: availableOnly ? { isAvailable: true } : {},
      include: {
        professional: {
          include: { user: { select: { fullName: true, avatarUrl: true } } },
        },
      },
      orderBy: { spotNumber: 'asc' },
    })
  }

  async findOne(id: string) {
    const spot = await this.prisma.rentalSpot.findUnique({
      where: { id },
      include: {
        professional: {
          include: { user: { select: { fullName: true } } },
        },
      },
    })
    if (!spot) throw new NotFoundException('Spot not found')
    return spot
  }

  async create(data: {
    spotNumber:  string
    type:        string
    dailyRate:   number
    weeklyRate:  number
    monthlyRate: number
    description?: string
    branchId?:   string
  }) {
    return this.prisma.rentalSpot.create({ data })
  }

  async update(id: string, data: any) {
    return this.prisma.rentalSpot.update({ where: { id }, data })
  }

  async setAvailability(id: string, isAvailable: boolean) {
    return this.prisma.rentalSpot.update({ where: { id }, data: { isAvailable } })
  }

  async remove(id: string) {
    await this.prisma.rentalSpot.delete({ where: { id } })
    return { message: 'Spot deleted' }
  }

  async getOccupancyStats() {
    const [total, occupied] = await Promise.all([
      this.prisma.rentalSpot.count(),
      this.prisma.rentalSpot.count({ where: { isAvailable: false } }),
    ])
    return {
      total,
      occupied,
      available: total - occupied,
      occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0,
    }
  }
}
