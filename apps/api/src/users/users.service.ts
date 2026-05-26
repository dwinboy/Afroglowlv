import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        professional: {
          include: {
            services: true,
            rentalSpot: true,
            portfolio:  true,
          },
        },
      },
    })
    if (!user) throw new NotFoundException('User not found')
    const { passwordHash, passwordResetToken, passwordResetExpiry, ...safe } = user as any
    return safe
  }

  async findAll(filters: {
    role?:   string
    search?: string
    page:    number
    limit:   number
  }) {
    const { role, search, page, limit } = filters
    const skip = (page - 1) * limit
    const where: any = {}

    if (role)   where.role = role
    if (search) where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email:    { contains: search, mode: 'insensitive' } },
    ]

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id:         true,
          email:      true,
          fullName:   true,
          role:       true,
          avatarUrl:  true,
          isActive:   true,
          isVerified: true,
          createdAt:  true,
          lastLoginAt:true,
        },
      }),
      this.prisma.user.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async update(id: string, dto: UpdateUserDto) {
    const { password, ...data } = dto as any
    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id:        true,
        email:     true,
        fullName:  true,
        role:      true,
        avatarUrl: true,
        phone:     true,
        isActive:  true,
      },
    })
    return updated
  }

  async setActive(id: string, isActive: boolean) {
    return this.prisma.user.update({ where: { id }, data: { isActive } })
  }

  async verify(id: string) {
    return this.prisma.user.update({ where: { id }, data: { isVerified: true } })
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } })
    return { message: 'User deleted successfully' }
  }
}
