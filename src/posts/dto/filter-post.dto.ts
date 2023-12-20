import { Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'

export class FilterPostDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit?: number

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number

  @IsOptional()
  title?: string

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'createdAt must be asc or desc' })
  createdAt?: string

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'views must be asc or desc' })
  view?: string // Don't have views
}
