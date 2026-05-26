import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Password123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string

  @ApiProperty({ enum: ['CUSTOMER', 'BARBER'], default: 'CUSTOMER' })
  @IsEnum(['CUSTOMER', 'BARBER'])
  @IsOptional()
  role?: 'CUSTOMER' | 'BARBER'
}
