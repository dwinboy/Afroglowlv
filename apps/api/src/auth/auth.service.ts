import {
  Injectable, UnauthorizedException,
  ConflictException, NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { MailService } from '../mail/mail.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma:  PrismaService,
    private readonly jwt:     JwtService,
    private readonly mail:    MailService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new ConflictException('Email already in use')

    const hashedPassword = await bcrypt.hash(dto.password, 12)

    const user = await this.prisma.user.create({
      data: {
        email:        dto.email,
        fullName:     dto.fullName,
        passwordHash: hashedPassword,
        role:         dto.role ?? 'CUSTOMER',
        isVerified:   false,
        isActive:     true,
      },
    })

    // Send welcome email (async, non-blocking)
    this.mail.sendWelcome(user.email, user.fullName).catch(() => {})

    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      access_token: this.jwt.sign(payload),
      user:         this.sanitizeUser(user),
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    if (!user.isActive) throw new UnauthorizedException('Account is deactivated')

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data:  { lastLoginAt: new Date() },
    })

    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      access_token: this.jwt.sign(payload),
      user:         this.sanitizeUser(user),
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        professional: {
          include: { rentalSpot: true },
        },
      },
    })
    if (!user) throw new NotFoundException('User not found')
    return this.sanitizeUser(user)
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.isActive) throw new UnauthorizedException()
    const payload = { sub: user.id, email: user.email, role: user.role }
    return { access_token: this.jwt.sign(payload) }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    // Always return 200 for security (don't reveal if email exists)
    if (!user) return { message: 'If this email exists, a reset link has been sent.' }

    const token  = uuidv4()
    const expiry = new Date(Date.now() + 1000 * 60 * 60) // 1h

    await this.prisma.user.update({
      where: { id: user.id },
      data:  { passwordResetToken: token, passwordResetExpiry: expiry },
    })

    await this.mail.sendPasswordReset(user.email, user.fullName, token)
    return { message: 'If this email exists, a reset link has been sent.' }
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken:  token,
        passwordResetExpiry: { gt: new Date() },
      },
    })
    if (!user) throw new UnauthorizedException('Invalid or expired reset token')

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await this.prisma.user.update({
      where: { id: user.id },
      data:  {
        passwordHash:        hashedPassword,
        passwordResetToken:  null,
        passwordResetExpiry: null,
      },
    })

    return { message: 'Password reset successfully. Please login.' }
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId, isActive: true } })
  }

  private sanitizeUser(user: any) {
    const { passwordHash, passwordResetToken, passwordResetExpiry, ...safe } = user
    return safe
  }
}
