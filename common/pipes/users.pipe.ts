import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { RegisterUserDto } from 'src/users/dto/registerUser.dto'

interface IRegisterUser {
  name: string
  email: string
  password: string
  confirm_password: string
}

@Injectable()
export class RegisterPipe implements PipeTransform {
  transform(value: IRegisterUser, metadata: ArgumentMetadata) {
    if (value.password !== value.confirm_password) {
      throw new BadRequestException('Confirm password not match')
    }

    return {
      name: value.name,
      email: value.email,
      password: value.password
    } as RegisterUserDto
  }
}
