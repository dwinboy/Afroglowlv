# 🌟 Afroglow — Premium Salon & Chair Rental Platform

> **The luxury salon coworking marketplace for beauty professionals in Lithuania.**
> Built with a gold-standard tech stack and a luxury-first design philosophy.

![Afroglow Banner](./apps/web/public/og-image.jpg)

---

## ✨ Overview

Afroglow is a full-stack **salon marketplace and chair-rental management platform** for Vilnius, Lithuania. Barbers, hairdressers, braiders, and beauty professionals can:

- **Rent working spots/chairs** at the salon
- **Manage their professional profiles** and portfolios
- **Receive client bookings** through the platform
- **Track earnings** and analytics

Clients can browse professionals, book appointments, and leave reviews — all through a luxury, mobile-first experience.

---

## 🛠 Tech Stack

| Layer        | Technology                                              |
|--------------|---------------------------------------------------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind |
| **Backend**  | NestJS, TypeScript, Prisma ORM                          |
| **Database** | PostgreSQL 16                                           |
| **Cache**    | Redis 7                                                 |
| **Auth**     | JWT                                                     |
| **Email**    | Nodemailer (SMTP)                                       |
| **Storage**  | Local/Cloudinary                                        |
| **Payments** | Stripe                                                  |
| **Deploy**   | Docker + Docker Compose + Nginx                         |

---

## 📁 Project Structure

```
Afroglowlv/
├── apps/
│   ├── web/                    # Next.js 14 Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (public)/   # Public pages (Home, About, Services…)
│   │   │   │   ├── (auth)/     # Auth pages (Login, Register)
│   │   │   │   ├── (dashboard)/# Barber dashboard
│   │   │   │   └── (admin)/    # Admin panel
│   │   │   ├── components/
│   │   │   │   └── layout/     # Navbar, Footer
│   │   │   ├── contexts/       # React contexts (Auth, I18n)
│   │   │   ├── i18n/           # EN + LT translations
│   │   │   └── lib/            # Utilities
│   │   └── Dockerfile
│   │
│   └── api/                    # NestJS Backend
│       ├── src/
│       │   ├── auth/           # JWT auth + guards
│       │   ├── users/          # User management
│       │   ├── bookings/       # Booking engine + QR check-in
│       │   ├── professionals/  # Professional profiles
│       │   ├── services/       # Service catalogue
│       │   ├── spots/          # Rental spot management
│       │   ├── applications/   # Rental applications
│       │   ├── reviews/        # Reviews & ratings
│       │   ├── contracts/      # Contract management
│       │   ├── analytics/      # Reports & charts
│       │   ├── notifications/  # Push + in-app notifications
│       │   ├── admin/          # Admin utilities
│       │   ├── mail/           # Email service (HTML templates)
│       │   ├── upload/         # File upload service
│       │   └── prisma/         # Prisma service
│       ├── prisma/
│       │   └── schema.prisma   # Full database schema
│       └── Dockerfile
│
├── docker-compose.yml           # Full stack Docker setup
├── turbo.json                   # Turborepo config
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **Docker** + **Docker Compose**
- **PostgreSQL** (or use Docker)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/afroglow.git
cd afroglow
npm install
```

### 2. Configure Environment

```bash
# API
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your values

# Frontend
cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local with your values
```

### 3. Start with Docker

```bash
# Start all services (DB, Redis, API, Web, Nginx)
docker-compose up -d

# Run database migrations
docker-compose exec api npx prisma migrate dev

# Seed default services
curl -X POST http://localhost:4000/api/admin/seed-services \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 4. Development Mode (without Docker)

```bash
# Start PostgreSQL locally or update DATABASE_URL in .env

# Run database migrations
npm run db:migrate

# Start all apps in dev mode
npm run dev
```

| Service     | URL                                   |
|-------------|---------------------------------------|
| Frontend    | http://localhost:3000                 |
| API         | http://localhost:4000/api             |
| Swagger     | http://localhost:4000/api/docs        |
| pgAdmin     | http://localhost:5050                 |

---

## 🔑 Roles & Access

| Role       | Access                                                        |
|------------|---------------------------------------------------------------|
| **Admin**  | Full platform management, analytics, user & spot management   |
| **Barber** | Own dashboard, bookings, earnings, portfolio, availability    |
| **Customer**| Browse, book appointments, leave reviews                     |

---

## 🌍 Internationalization

The platform supports **English** and **Lithuanian** via a custom i18n context.

Toggle language using the globe icon in the navbar.
Translations are in `apps/web/src/i18n/`.

---

## 📊 Key Features

- ✅ **Multi-step booking engine** with availability checking
- ✅ **QR code check-in** for appointments
- ✅ **Luxury gold UI** with glassmorphism and animations
- ✅ **Admin analytics dashboard** (revenue, occupancy, top pros)
- ✅ **Rental application system** with approval workflow
- ✅ **Contract management** with expiry reminders
- ✅ **Email notifications** with HTML templates
- ✅ **Role-based access control** (Admin / Barber / Customer)
- ✅ **GDPR-ready** architecture
- ✅ **Multi-branch ready** database design
- ✅ **Responsive** on all devices
- ✅ **EN + LT** language support

---

## 🗄 Database Schema

The Prisma schema (`apps/api/prisma/schema.prisma`) includes:

| Model                 | Purpose                              |
|-----------------------|--------------------------------------|
| `User`                | All users (admin, barber, customer)  |
| `Professional`        | Barber/stylist profiles              |
| `RentalSpot`          | Chairs/stations at the salon         |
| `RentalApplication`   | Spot rental request workflow         |
| `Service`             | Service catalogue (haircut, braids…) |
| `Booking`             | Appointments (registered + guest)    |
| `Portfolio`           | Professional work photos/videos      |
| `Review`              | Client reviews with ratings          |
| `Availability`        | Weekly working hours per professional|
| `Payment`             | Payment transactions                 |
| `Contract`            | Rental contracts with PDF support    |
| `Notification`        | In-app notification inbox            |
| `Branch`              | Multi-location support               |
| `LoyaltyTransaction`  | Points system                        |
| `AnalyticsSnapshot`   | Daily analytics aggregates           |

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Include dev tools (pgAdmin)
docker-compose --profile dev up -d

# View logs
docker-compose logs -f api

# Stop all
docker-compose down

# Reset database
docker-compose down -v && docker-compose up -d
```

---

## 🔒 Security

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Helmet.js security headers
- ✅ Rate limiting (10 req/s, 200 req/min)
- ✅ Input validation with class-validator
- ✅ Role-based access control
- ✅ Secure file upload validation
- ✅ CORS configured per environment
- ✅ GDPR consent tracking

---

## 📧 Email Templates

Transactional emails include:

| Template              | Trigger                          |
|-----------------------|----------------------------------|
| Welcome               | User registration                |
| Booking Confirmation  | Appointment confirmed            |
| Password Reset        | Forgot password flow             |
| Application Approved  | Rental application decision      |
| Rental Expiry Reminder| Contract expiring in 7 days      |

---

## 🚢 Deployment

### Production with Docker

```bash
# Build and start
docker-compose -f docker-compose.yml up -d --build

# Run migrations
docker-compose exec api npx prisma migrate deploy

# Check health
curl https://afroglow.lt/api/health
```

### Environment Variables (Production checklist)

- [ ] `JWT_SECRET` — Strong, random 64-char string
- [ ] `DATABASE_URL` — Production PostgreSQL connection
- [ ] `SMTP_*` — Production SMTP settings
- [ ] `STRIPE_SECRET_KEY` — Live Stripe key
- [ ] `CLOUDINARY_*` — For production file storage

### Vercel (Web) + Neon (Database) setup

1. Deploy API first (Render/Railway/Fly.io/VPS).

2. Create Neon database and copy both connection strings:
  - pooled URL -> `DATABASE_URL`
  - direct URL -> `DIRECT_URL`

3. API production env values:
  - `DATABASE_URL` = Neon pooled URL (with `sslmode=require`)
  - `DIRECT_URL` = Neon direct URL (with `sslmode=require`)
  - `FRONTEND_URL` = your Vercel app URL
  - `FRONTEND_URLS` = comma-separated additional frontend URLs (custom domain + preview if needed)
  - `API_URL` = public API base domain

4. Run Prisma in production from API deployment target:

```bash
npx prisma generate
npx prisma migrate deploy
```

5. Deploy web app on Vercel:
  - Framework preset: Next.js
  - Root directory: `apps/web`
  - Build command: `npm run build`
  - Install command: `npm install`
  - Environment variable: `NEXT_PUBLIC_API_URL=https://<api-domain>/api`

6. Verify production:
  - Open `https://<api-domain>/api/health`
  - Test login/register from Vercel domain
  - Test booking + rental application flows

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

© 2024 Afroglow. All rights reserved.

---

<div align="center">
  <strong>Built with 🌟 in Lithuania</strong>
  <br/>
  <em>Afroglow — Where Beauty Meets Excellence</em>
</div>
