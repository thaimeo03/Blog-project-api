import { IsNotEmpty } from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty()
  title: string

  thumbnail?: string

  content?: string
}
