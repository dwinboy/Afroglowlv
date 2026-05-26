import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ApplicationsService } from './applications.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('applications')
@Controller('rental-applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a rental application' })
  create(@Body() dto: any) {
    return this.applicationsService.create(dto)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all applications (Admin)' })
  findAll(
    @Query('status') status?: string,
    @Query('page')   page  = 1,
    @Query('limit')  limit = 20,
  ) {
    return this.applicationsService.findAll({ status, page: +page, limit: +limit })
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get application by ID (Admin)' })
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id)
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve application (Admin)' })
  approve(@Param('id') id: string, @Body('spotId') spotId?: string) {
    return this.applicationsService.approve(id, spotId)
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject application (Admin)' })
  reject(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.applicationsService.reject(id, reason)
  }
}
