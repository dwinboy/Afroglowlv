import { IsString, IsOptional, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  serviceId: string

  @ApiProperty()
  @IsString()
  professionalId: string

  @ApiProperty({ example: '2026-06-15' })
  @IsString()
  date: string

  @ApiProperty({ example: '10:30' })
  @IsString()
  time: string

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: '+370 600 00000' })
  @IsString()
  phone: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  branchId?: string
}
