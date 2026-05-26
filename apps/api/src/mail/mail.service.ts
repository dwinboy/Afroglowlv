import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host:   config.get('SMTP_HOST', 'smtp.gmail.com'),
      port:   config.get<number>('SMTP_PORT', 587),
      secure: config.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: config.get('SMTP_USER', ''),
        pass: config.get('SMTP_PASS', ''),
      },
    })
  }

  private get from() {
    return `"Afroglow" <${this.config.get('SMTP_FROM', 'hello@afroglow.lt')}>`
  }

  async sendWelcome(email: string, name: string) {
    return this.transporter.sendMail({
      from:    this.from,
      to:      email,
      subject: `Welcome to Afroglow, ${name}! 🌟`,
      html:    this.welcomeTemplate(name),
    })
  }

  async sendBookingConfirmation(booking: any) {
    const email = booking.guestEmail ?? booking.customer?.email
    const name  = booking.guestName  ?? booking.customer?.fullName
    if (!email) return

    return this.transporter.sendMail({
      from:    this.from,
      to:      email,
      subject: `Booking Confirmed — ${booking.service?.name ?? 'Appointment'} at Afroglow`,
      html:    this.bookingConfirmationTemplate(booking, name),
    })
  }

  async sendPasswordReset(email: string, name: string, token: string) {
    const resetUrl = `${this.config.get('FRONTEND_URL')}/auth/reset-password?token=${token}`
    return this.transporter.sendMail({
      from:    this.from,
      to:      email,
      subject: 'Reset Your Afroglow Password',
      html:    this.passwordResetTemplate(name, resetUrl),
    })
  }

  async sendApplicationStatus(
    email: string,
    name: string,
    status: 'approved' | 'rejected',
    reason?: string,
  ) {
    return this.transporter.sendMail({
      from:    this.from,
      to:      email,
      subject: `Your Afroglow Application — ${status === 'approved' ? '✅ Approved!' : 'Update'}`,
      html:    this.applicationStatusTemplate(name, status, reason),
    })
  }

  async sendRentalReminder(email: string, name: string, expiresAt: Date) {
    return this.transporter.sendMail({
      from:    this.from,
      to:      email,
      subject: '⚠️ Your Afroglow Rental is Expiring Soon',
      html:    this.rentalReminderTemplate(name, expiresAt),
    })
  }

  async sendProfessionalWelcome(email: string, name: string, tempPassword: string) {
    return this.transporter.sendMail({
      from:    this.from,
      to:      email,
      subject: '🌟 Welcome to Afroglow — Your Account is Ready',
      html:    this.professionalWelcomeTemplate(name, email, tempPassword),
    })
  }

  /* ── Email Templates ──────────────────── */

  private baseTemplate(content: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Inter', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #D4AF37, #C19B26); padding: 32px; text-align: center; }
        .header h1 { color: #000; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -1px; }
        .body { padding: 32px; }
        .footer { padding: 24px 32px; border-top: 1px solid #2A2A2A; text-align: center; color: #666; font-size: 12px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #D4AF37, #C19B26); color: #000 !important;
               padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; margin: 16px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #2A2A2A; }
        .info-label { color: #888; font-size: 14px; }
        .info-value { color: #fff; font-weight: 600; font-size: 14px; }
        p { color: #ccc; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div style="padding: 24px;">
        <div class="container">
          ${content}
          <div class="footer">
            <p>© ${new Date().getFullYear()} Afroglow · Vilnius, Lithuania</p>
            <p>Premium Salon & Chair Rental Platform</p>
          </div>
        </div>
      </div>
    </body>
    </html>`
  }

  private welcomeTemplate(name: string) {
    return this.baseTemplate(`
      <div class="header"><h1>🌟 Afroglow</h1></div>
      <div class="body">
        <h2 style="color: #D4AF37;">Welcome, ${name}!</h2>
        <p>We're thrilled to have you in the Afroglow family. Discover premium hair & beauty services or build your career with us.</p>
        <div style="text-align: center;">
          <a href="${this.config.get('FRONTEND_URL')}" class="btn">Explore Afroglow</a>
        </div>
      </div>`)
  }

  private bookingConfirmationTemplate(booking: any, name: string) {
    return this.baseTemplate(`
      <div class="header"><h1>✅ Booking Confirmed</h1></div>
      <div class="body">
        <h2 style="color: #D4AF37;">See you there, ${name}!</h2>
        <p>Your appointment has been confirmed. Here are your details:</p>
        <div style="background: #111; border-radius: 12px; padding: 20px; margin: 16px 0;">
          <div class="info-row"><span class="info-label">Service</span><span class="info-value">${booking.service?.name ?? 'Appointment'}</span></div>
          <div class="info-row"><span class="info-label">Date</span><span class="info-value">${booking.date}</span></div>
          <div class="info-row"><span class="info-label">Time</span><span class="info-value">${booking.time}</span></div>
          <div class="info-row" style="border:0"><span class="info-label">Reference</span><span class="info-value" style="color:#D4AF37">#${booking.id.slice(0, 8).toUpperCase()}</span></div>
        </div>
        <p><strong style="color:#fff">Address:</strong> Kalvarijų g. 88, Vilnius, Lithuania</p>
        <p>Need to cancel? Reply to this email at least 24 hours before your appointment.</p>
      </div>`)
  }

  private passwordResetTemplate(name: string, resetUrl: string) {
    return this.baseTemplate(`
      <div class="header"><h1>🔐 Afroglow</h1></div>
      <div class="body">
        <h2 style="color: #D4AF37;">Reset Your Password</h2>
        <p>Hi ${name}, we received a request to reset your password. Click below to create a new one:</p>
        <div style="text-align: center;">
          <a href="${resetUrl}" class="btn">Reset Password</a>
        </div>
        <p style="font-size: 12px; color: #666;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
      </div>`)
  }

  private applicationStatusTemplate(name: string, status: 'approved' | 'rejected', reason?: string) {
    const isApproved = status === 'approved'
    return this.baseTemplate(`
      <div class="header"><h1>${isApproved ? '✅' : '📋'} Application Update</h1></div>
      <div class="body">
        <h2 style="color: #D4AF37;">Hi ${name},</h2>
        ${isApproved
          ? '<p>🎉 Congratulations! Your application to rent a spot at Afroglow has been <strong style="color:#D4AF37">approved!</strong> We\'ll be in touch with next steps.</p>'
          : `<p>Thank you for your interest in Afroglow. Unfortunately, your application was not approved at this time.${reason ? ` Reason: ${reason}` : ''}</p><p>You\'re welcome to apply again in the future.</p>`
        }
        <div style="text-align: center; margin-top: 24px;">
          <a href="${this.config.get('FRONTEND_URL')}" class="btn">Visit Afroglow</a>
        </div>
      </div>`)
  }

  private rentalReminderTemplate(name: string, expiresAt: Date) {
    return this.baseTemplate(`
      <div class="header"><h1>⚠️ Rental Expiring Soon</h1></div>
      <div class="body">
        <h2 style="color: #D4AF37;">Hi ${name},</h2>
        <p>Your Afroglow spot rental expires on <strong style="color:#D4AF37">${expiresAt.toLocaleDateString('en')}</strong>.</p>
        <p>Renew now to keep your station and clients without any interruption.</p>
        <div style="text-align: center; margin-top: 24px;">
          <a href="${this.config.get('FRONTEND_URL')}/dashboard/rental" class="btn">Renew Now</a>
        </div>
      </div>`)
  }

  private professionalWelcomeTemplate(name: string, email: string, tempPassword: string) {
    const loginUrl = `${this.config.get('FRONTEND_URL')}/auth/login`
    return this.baseTemplate(`
      <div class="header"><h1>🌟 Welcome to Afroglow</h1></div>
      <div class="body">
        <h2 style="color: #D4AF37;">Hi ${name}, your account is ready!</h2>
        <p>The Afroglow team has created your professional account. You can now log in to manage your bookings, schedule, and profile.</p>
        <div style="background: #111; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <div class="info-row"><span class="info-label">Login Email</span><span class="info-value">${email}</span></div>
          <div class="info-row" style="border:0"><span class="info-label">Temporary Password</span><span class="info-value" style="color:#D4AF37; letter-spacing: 2px;">${tempPassword}</span></div>
        </div>
        <p style="color:#f87171; font-size:13px;">⚠️ For your security, please change your password immediately after your first login.</p>
        <div style="text-align: center; margin-top: 24px;">
          <a href="${loginUrl}" class="btn">Log In to Your Dashboard</a>
        </div>
        <p style="font-size:12px; color:#555; margin-top: 24px;">If you have any questions, reply to this email or contact us at hello@afroglow.lt</p>
      </div>`)
  }
}
