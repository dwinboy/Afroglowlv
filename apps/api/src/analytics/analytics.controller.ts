import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AnalyticsService } from './analytics.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get platform analytics overview' })
  getOverview() {
    return this.analyticsService.getOverview()
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  getRevenue(@Query('period') period = 'monthly') {
    return this.analyticsService.getRevenue(period)
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get booking statistics' })
  getBookings(@Query('period') period = 'monthly') {
    return this.analyticsService.getBookings(period)
  }

  @Get('occupancy')
  @ApiOperation({ summary: 'Get spot occupancy rate' })
  getOccupancy() {
    return this.analyticsService.getOccupancy()
  }

  @Get('top-professionals')
  @ApiOperation({ summary: 'Get top performing professionals' })
  getTopProfessionals(@Query('limit') limit = 10) {
    return this.analyticsService.getTopProfessionals(+limit)
  }

  @Get('services')
  @ApiOperation({ summary: 'Get service distribution analytics' })
  getServiceDistribution() {
    return this.analyticsService.getServiceDistribution()
  }
}
