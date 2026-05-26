import { PartialType } from '@nestjs/swagger'
import { CreateBookingDto } from './create-booking.dto'
import { IsEnum, IsOptional } from 'class-validator'

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
  status?: string
}
