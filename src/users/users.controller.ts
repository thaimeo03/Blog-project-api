import { Body, Controller, Post, UsePipes, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { LoginUserDto } from './dto/loginUser.dto'
import { RegisterUserDto } from './dto/registerUser.dto'
import { RegisterPipe } from 'common/pipes/users.pipe'
import { UsersService } from './users.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/users.enum'
import { AuthGuard } from './users.guard'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(new RegisterPipe())
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto)
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Body() { refresh_token }: { refresh_token: string }) {
    return this.usersService.logout(refresh_token)
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard)
  refreshToken(@Body() { refresh_token }: { refresh_token: string }) {
    return this.usersService.refreshToken(refresh_token)
  }
}
