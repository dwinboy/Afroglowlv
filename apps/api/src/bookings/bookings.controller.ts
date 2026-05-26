import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, UseGuards, Request,
  HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { BookingsService } from './bookings.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { UpdateBookingDto } from './dto/update-booking.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new booking' })
  create(@Body() dto: CreateBookingDto, @Request() req: any) {
    const userId = req.user?.id
    return this.bookingsService.create(dto, userId)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get bookings (filtered by role)' })
  @ApiQuery({ name: 'status',   required: false })
  @ApiQuery({ name: 'date',     required: false })
  @ApiQuery({ name: 'page',     required: false })
  @ApiQuery({ name: 'limit',    required: false })
  findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.bookingsService.findAll(req.user, { status, date, page: +page, limit: +limit })
  }

  @Get('calendar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BARBER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get bookings in calendar format' })
  getCalendar(
    @Request() req: any,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.bookingsService.getCalendar(req.user.id, +month, +year)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID' })
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.findOne(id, req.user)
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BARBER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    return this.bookingsService.updateStatus(id, status, req.user)
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.cancel(id, req.user)
  }

  @Get(':id/qr')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate QR code for booking check-in' })
  getQrCode(@Param('id') id: string) {
    return this.bookingsService.generateQrCode(id)
  }

  @Post(':id/checkin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BARBER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'QR check-in for appointment' })
  checkIn(@Param('id') id: string) {
    return this.bookingsService.checkIn(id)
  }
}
