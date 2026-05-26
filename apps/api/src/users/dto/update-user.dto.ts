import { IsString, IsEmail, IsOptional } from 'class-validator'

export class UpdateUserDto {
  @IsOptional() @IsString()  fullName?: string
  @IsOptional() @IsEmail()   email?: string
  @IsOptional() @IsString()  phone?: string
  @IsOptional() @IsString()  avatarUrl?: string
  @IsOptional() @IsString()  bio?: string
}
