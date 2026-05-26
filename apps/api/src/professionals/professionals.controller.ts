import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ProfessionalsService } from './professionals.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('professionals')
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly svc: ProfessionalsService) {}

  @Get()
  @ApiOperation({ summary: 'List all approved professionals' })
  findAll(
    @Query('speciality') speciality?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.svc.findAll({ speciality, search, page: +page, limit: +limit })
  }

  /* ── My profile (BARBER routes — must come before :id) ── */

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BARBER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own professional profile' })
  getMe(@Request() req: any) {
    return this.svc.getMe(req.user.id)
  }

  @Get('me/portfolio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BARBER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own portfolio items' })
  getMyPortfolio(@Request() req: any) {
    return this.svc.getMyPortfolio(req.user.id)
  }

  @Post('me/portfolio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BARBER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add portfolio item' })
  addPortfolioItem(@Request() req: any, @Body() dto: any) {
    return this.svc.addPortfolioItem(req.user.id, dto)
  }

  @Delete('me/portfolio/:itemId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BARBER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete portfolio item' })
  deletePortfolioItem(@Request() req: any, @Param('itemId') itemId: string) {
    return this.svc.deletePortfolioItem(req.user.id, itemId)
  }

  @Put('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BARBER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own professional profile' })
  updateProfile(@Request() req: any, @Body() dto: any) {
    return this.svc.updateProfile(req.user.id, dto)
  }

  /* ── Public routes ── */

  @Get(':id')
  @ApiOperation({ summary: 'Get professional profile' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id)
  }

  @Get(':id/availability')
  @ApiOperation({ summary: "Get professional's availability" })
  getAvailability(@Param('id') id: string, @Query('date') date?: string) {
    return this.svc.getAvailability(id, date)
  }
}

