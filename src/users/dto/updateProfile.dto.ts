import { MinLength, IsOptional, IsUrl, IsDateString } from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @MinLength(3)
  name: string

  @IsOptional()
  @IsUrl()
  avatar: string

  @IsOptional()
  address: string

  @IsOptional()
  @IsDateString()
  birthday: Date

  constructor(data?: Partial<UpdateProfileDto>) {
    Object.assign(this, data)
  }
}
