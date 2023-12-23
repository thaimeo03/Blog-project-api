import { IsOptional, MinLength } from 'class-validator'

export class UpdatePostDto {
  @IsOptional()
  @MinLength(1)
  title: string

  @IsOptional()
  thumbnail?: string

  @IsOptional()
  content?: string

  constructor(data?: Partial<UpdatePostDto>) {
    Object.assign(this, data)
  }
}
