import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(category?: string, includeInactive = false) {
    return this.prisma.service.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(category ? { category } : {}),
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })
  }

  async findOne(id: string) {
    const s = await this.prisma.service.findUnique({ where: { id } })
    if (!s) throw new NotFoundException()
    return s
  }

  create(data: any) {
    return this.prisma.service.create({ data })
  }

  update(id: string, data: any) {
    return this.prisma.service.update({ where: { id }, data })
  }

  async remove(id: string) {
    await this.prisma.service.delete({ where: { id } })
    return { message: 'Service deleted' }
  }
}
