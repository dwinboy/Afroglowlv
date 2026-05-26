import { Injectable, NotFoundException } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(status?: string) {
    return this.prisma.contract.findMany({
      where: status ? { status: status as any } : {},
      include: {
        professional: {
          include: { user: { select: { fullName: true, email: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const c = await this.prisma.contract.findUnique({
      where: { id },
      include: { professional: { include: { user: true } } },
    })
    if (!c) throw new NotFoundException()
    return c
  }

  create(data: any) {
    return this.prisma.contract.create({ data })
  }

  sign(id: string) {
    return this.prisma.contract.update({
      where: { id },
      data:  { status: 'SIGNED', signedAt: new Date() },
    })
  }

  async remove(id: string) {
    await this.prisma.contract.delete({ where: { id } })
    return { message: 'Contract deleted' }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkExpiringContracts() {
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

    const expiring = await this.prisma.contract.findMany({
      where: {
        status:    'ACTIVE',
        expiresAt: { lte: sevenDaysFromNow, gte: new Date() },
      },
      include: {
        professional: { include: { user: true } },
      },
    })

    console.log(`[Contracts] ${expiring.length} contracts expiring within 7 days`)
    // In production: send renewal reminder emails for each
  }
}
