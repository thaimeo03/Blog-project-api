import { Transform } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class FilterPostDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit?: number

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page?: number
}
