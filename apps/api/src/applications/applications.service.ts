import { Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { MailService } from '../mail/mail.service'

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail:   MailService,
  ) {}

  async create(dto: {
    fullName:        string
    email:           string
    phone:           string
    profession:      string
    yearsExperience: string
    specialization:  string
    instagramHandle?: string
    rentalDuration:  string
    startDate:       string
    message:         string
  }) {
    const application = await this.prisma.rentalApplication.create({
      data: {
        ...dto,
        status: 'PENDING',
      },
    })

    return application
  }

  async findAll(filters: { status?: string; page: number; limit: number }) {
    const { status, page, limit } = filters
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status

    const [data, total] = await Promise.all([
      this.prisma.rentalApplication.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rentalApplication.count({ where }),
    ])

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const application = await this.prisma.rentalApplication.findUnique({ where: { id } })
    if (!application) throw new NotFoundException('Application not found')
    return application
  }

  async approve(id: string, spotId?: string) {
    const application = await this.findOne(id)

    // Create user account for the applicant
    const tempPassword = Math.random().toString(36).slice(2, 10)
    const hashedPw     = await bcrypt.hash(tempPassword, 12)

    const user = await this.prisma.user.upsert({
      where: { email: application.email },
      create: {
        email:        application.email,
        fullName:     application.fullName,
        passwordHash: hashedPw,
        role:         'BARBER',
        phone:        application.phone,
        isVerified:   true,
        isActive:     true,
      },
      update: { role: 'BARBER', isVerified: true, isActive: true },
    })

    // Create professional profile
    const professional = await this.prisma.professional.upsert({
      where: { userId: user.id },
      create: {
        userId:             user.id,
        specialization:     application.specialization,
        instagramHandle:    application.instagramHandle ?? null,
        yearsOfExperience:  parseInt(application.yearsExperience, 10) || 0,
        rentalSpotId:       spotId ?? null,
        rentalStatus:       'ACTIVE',
        rentalPlan:         application.rentalDuration.toUpperCase() as any,
        rentalStartDate:    new Date(application.startDate),
      },
      update: {
        specialization:  application.specialization,
        rentalSpotId:    spotId ?? null,
        rentalStatus:    'ACTIVE',
        rentalPlan:      application.rentalDuration.toUpperCase() as any,
        rentalStartDate: new Date(application.startDate),
      },
    })

    // Update spot availability
    if (spotId) {
      await this.prisma.rentalSpot.update({
        where: { id: spotId },
        data:  { isAvailable: false },
      })
    }

    // Update application status
    const updated = await this.prisma.rentalApplication.update({
      where: { id },
      data:  { status: 'APPROVED', reviewedAt: new Date() },
    })

    // Send approval email
    this.mail.sendApplicationStatus(application.email, application.fullName, 'approved').catch(() => {})

    return { application: updated, user, professional, tempPassword }
  }

  async reject(id: string, reason?: string) {
    const application = await this.findOne(id)

    const updated = await this.prisma.rentalApplication.update({
      where: { id },
      data:  { status: 'REJECTED', rejectionReason: reason, reviewedAt: new Date() },
    })

    this.mail.sendApplicationStatus(
      application.email, application.fullName, 'rejected', reason,
    ).catch(() => {})

    return updated
  }
}
