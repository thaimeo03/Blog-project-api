import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { LoginUserDto } from './dto/loginUser.dto'
import { RegisterUserDto } from './dto/registerUser.dto'
import { RegisterPipe } from 'common/pipes/users.pipe'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(new RegisterPipe())
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto)
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return loginUserDto
  }

  @Post('refresh-token')
  refreshToken(@Body() { refresh_token }: { refresh_token: string }) {
    return this.usersService.refreshToken(refresh_token)
  }
}
