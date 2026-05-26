import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { userId: string; type: string; title: string; body: string; metadata?: any }) {
    return this.prisma.notification.create({ data: data as any })
  }

  async getAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }

  async markRead(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { isRead: true, readAt: new Date() } })
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data:  { isRead: true, readAt: new Date() },
    })
    return { message: 'All notifications marked as read' }
  }

  @OnEvent('booking.created')
  async handleBookingCreated(booking: any) {
    const professionalUserId = booking.professional?.userId
    if (professionalUserId) {
      await this.create({
        userId: professionalUserId,
        type:   'BOOKING_NEW',
        title:  'New Booking',
        body:   `New appointment on ${booking.date} at ${booking.time}`,
        metadata: { bookingId: booking.id },
      })
    }
  }

  @OnEvent('booking.statusChanged')
  async handleBookingStatusChanged(booking: any) {
    if (booking.customerId) {
      await this.create({
        userId: booking.customerId,
        type:   'BOOKING_UPDATED',
        title:  'Booking Updated',
        body:   `Your booking status changed to ${booking.status}`,
        metadata: { bookingId: booking.id },
      })
    }
  }
}
