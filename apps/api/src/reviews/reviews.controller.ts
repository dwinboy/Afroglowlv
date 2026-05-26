import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ReviewsService } from './reviews.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all reviews (Admin)' })
  getAll(@Query('page') page = 1, @Query('limit') limit = 50) {
    return this.reviewsService.getAll(+page, +limit)
  }

  @Patch(':id/visibility')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle review visibility (Admin)' })
  toggleVisibility(@Param('id') id: string) {
    return this.reviewsService.toggleVisibility(id)
  }

  @Get('professional/:id')
  @ApiOperation({ summary: 'Get reviews for a professional' })
  getForProfessional(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.reviewsService.getForProfessional(id, +page, +limit)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a review' })
  create(@Body() dto: any, @Request() req: any) {
    return this.reviewsService.create({ ...dto, authorId: req.user.id })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review (Admin)' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id)
  }
}
