import {
  Body,
  Controller,
  Post,
  UsePipes,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Patch,
  Query,
  Res
} from '@nestjs/common'
import { LoginUserDto } from './dto/loginUser.dto'
import { RegisterUserDto } from './dto/registerUser.dto'
import { RegisterPipe } from 'common/pipes/users.pipe'
import { UsersService } from './users.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/users.enum'
import { AuthGuard } from './users.guard'
import { Request, Response } from 'express'
import { UpdateProfileDto } from './dto/updateProfile.dto'
import { GoogleQueryDto } from './dto/google.dto'
import { ConfigService } from '@nestjs/config'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService
  ) {}

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

  @Get('/oauth/google')
  @HttpCode(HttpStatus.OK)
  async loginWithGoogle(@Res() res: Response, @Query() query: GoogleQueryDto) {
    const { access_token, refresh_token } = await this.usersService.loginWithGoogle(query.code)

    return res.redirect(
      `${this.configService.get('CLIENT_URL')}/login?access_token=${access_token}&&refresh_token=${refresh_token}`
    )
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Body() { refresh_token }: { refresh_token: string }) {
    return this.usersService.logout(refresh_token)
  }

  @Post('refresh-token')
  refreshToken(@Body() { refresh_token }: { refresh_token: string }) {
    return this.usersService.refreshToken(refresh_token)
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  getProfile(@Req() req: Request) {
    return this.usersService.getProfile(req['user'].userId)
  }

  @Patch()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  update(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    const id = req['user'].userId

    return this.usersService.updateProfile({ id, updateProfileDto })
  }
}
