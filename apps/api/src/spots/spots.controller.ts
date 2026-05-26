import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { SpotsService } from './spots.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('spots')
@Controller('spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all rental spots' })
  findAll(@Query('available') available?: string) {
    return this.spotsService.findAll(available === 'true')
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get spot by ID' })
  findOne(@Param('id') id: string) {
    return this.spotsService.findOne(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new spot (Admin)' })
  create(@Body() dto: any) {
    return this.spotsService.create(dto)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update spot (Admin)' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.spotsService.update(id, dto)
  }

  @Patch(':id/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle spot availability (Admin)' })
  toggleAvailability(@Param('id') id: string, @Body('isAvailable') isAvailable: boolean) {
    return this.spotsService.setAvailability(id, isAvailable)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete spot (Admin)' })
  remove(@Param('id') id: string) {
    return this.spotsService.remove(id)
  }
}
