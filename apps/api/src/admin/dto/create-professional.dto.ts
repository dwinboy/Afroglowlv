import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsInt, Min, Max, IsObject } from 'class-validator'

export class ProfessionalPermissionsDto {
  @ApiPropertyOptional({ default: true })
  canAcceptBookings?: boolean

  @ApiPropertyOptional({ default: true })
  canManageServices?: boolean

  @ApiPropertyOptional({ default: true })
  canViewEarnings?: boolean

  @ApiPropertyOptional({ default: true })
  canManagePortfolio?: boolean

  @ApiPropertyOptional({ default: true })
  canAccessCalendar?: boolean

  @ApiPropertyOptional({ default: true })
  canReceiveReviews?: boolean
}

export class CreateProfessionalDto {
  @ApiProperty({ example: 'Kwame Asante' })
  @IsString() @IsNotEmpty()
  fullName: string

  @ApiProperty({ example: 'kwame@example.com' })
  @IsEmail()
  email: string

  @ApiPropertyOptional({ example: '+370 600 00000' })
  @IsOptional() @IsString()
  phone?: string

  @ApiPropertyOptional({ example: 'Barber' })
  @IsOptional() @IsString()
  specialization?: string

  @ApiPropertyOptional({ example: 5 })
  @IsOptional() @IsInt() @Min(0) @Max(50)
  yearsOfExperience?: number

  @ApiPropertyOptional({ example: 'Specialises in fades and textured hair.' })
  @IsOptional() @IsString()
  bio?: string

  @ApiPropertyOptional({ example: '@kwame.cuts' })
  @IsOptional() @IsString()
  instagramHandle?: string

  @ApiPropertyOptional({ example: 'spot-id-here' })
  @IsOptional() @IsString()
  rentalSpotId?: string

  @ApiPropertyOptional({ enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'] })
  @IsOptional() @IsString()
  rentalPlan?: string

  @ApiPropertyOptional({ type: ProfessionalPermissionsDto })
  @IsOptional() @IsObject()
  permissions?: ProfessionalPermissionsDto

  @ApiPropertyOptional({ example: 'Referred by Ama Osei.' })
  @IsOptional() @IsString()
  adminNotes?: string
}

export class UpdateProfessionalPermissionsDto {
  @ApiProperty({ type: ProfessionalPermissionsDto })
  @IsObject()
  permissions: ProfessionalPermissionsDto

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  adminNotes?: string
}
