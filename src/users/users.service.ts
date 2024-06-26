import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'database/entities/user.entity'
import { Repository } from 'typeorm'
import { RegisterUserDto } from './dto/registerUser.dto'
import { ResponseData } from 'common/customs/responseData'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Role } from 'common/enums/users.enum'
import { LoginUserDto } from './dto/loginUser.dto'
import { UpdateProfileDto } from './dto/updateProfile.dto'
import { HttpService } from '@nestjs/axios'
import { GoogleDataUserDto } from './dto/google.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersService: Repository<User>,
    private readonly httpService: HttpService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    try {
      // Check if user exists
      const userExists = await this.usersService.findOneBy({
        email: registerUserDto.email
      })
      if (userExists) {
        throw new BadRequestException('User already exists')
      }

      // Save user
      const passwordHashed = await this.hashPassword(registerUserDto.password)
      const user = await this.usersService.save({
        ...registerUserDto,
        password: passwordHashed
      })

      // Create token
      const { access_token, refresh_token } = await this.createToken({ userId: user.id, role: user.role })
      // Update user
      await this.usersService.update(user.id, {
        refreshToken: refresh_token
      })

      return new ResponseData({
        message: 'Register successfully',
        data: {
          access_token,
          refresh_token
        }
      })
    } catch (error) {
      throw error
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      // Find user by email and passwordHashed
      const user = await this.getUserByEmail(loginUserDto.email)
      if (!user) {
        throw new NotFoundException('User not found')
      }
      const isMatchPassword = await bcrypt.compare(loginUserDto.password, user.password)
      if (!isMatchPassword) {
        throw new NotFoundException('User not found')
      }
      // Create token
      const { access_token, refresh_token } = await this.createToken({ userId: user.id, role: user.role })
      // Update user
      await this.usersService.update(user.id, {
        refreshToken: refresh_token
      })

      return new ResponseData({
        message: 'Login successfully',
        data: {
          access_token,
          refresh_token
        }
      })
    } catch (error) {
      throw error
    }
  }

  async loginWithGoogle(code: string) {
    try {
      const { access_token: google_access_token, id_token } = await this.getGoogleToken(code)
      const { data } = await this.httpService.axiosRef.get<GoogleDataUserDto>(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
          params: {
            access_token: google_access_token,
            alt: 'json'
          },
          headers: {
            Authorization: `Bearer ${id_token}`
          }
        }
      )

      const { name, email, picture } = data
      // Check if user exists
      let userId: string | null = null
      let role: Role = Role.USER
      const user = await this.getUserByEmail(email)
      if (user) {
        userId = user.id
        role = user.role
      } else {
        // Create user
        const passwordHashed = await this.hashPassword(email)
        const newUser = await this.usersService.save({
          name,
          email,
          password: passwordHashed,
          avatar: picture
        })
        userId = newUser.id
        role = newUser.role
      }

      // Create token
      const { access_token, refresh_token } = await this.createToken({
        userId: userId,
        role: role
      })
      // Update user
      await this.usersService.update(userId, {
        refreshToken: refresh_token
      })

      return {
        access_token,
        refresh_token
      }
    } catch (error) {
      throw error
    }
  }

  async logout(refresh_token: string) {
    try {
      // Check if refresh token exists
      if (!refresh_token) {
        throw new NotFoundException('Refresh token not found')
      }
      // Find user
      const user = await this.usersService.findOneBy({
        refreshToken: refresh_token
      })
      if (!user) {
        throw new NotFoundException('Refresh token not found')
      }
      // Update user
      await this.usersService.update(user.id, {
        refreshToken: null
      })
      return new ResponseData({
        message: 'Logout successfully'
      })
    } catch (error) {
      throw error
    }
  }

  async refreshToken(refresh_token: string) {
    try {
      // Check if refresh token exists
      if (!refresh_token) {
        throw new BadRequestException('Refresh token not found')
      }

      // Find refresh token in database
      const user = await this.usersService.findOneBy({
        refreshToken: refresh_token
      })
      if (!user) {
        throw new BadRequestException('Refresh token not found')
      }

      // Create new access token
      const access_token = await this.createAccessToken({ userId: user.id, role: user.role })
      return new ResponseData({
        message: 'Refresh token successfully',
        data: {
          access_token
        }
      })
    } catch (error) {
      throw error
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        address: true,
        birthday: true,
        createdAt: true,
        updatedAt: true
      }
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return new ResponseData({
      message: 'Get profile successfully',
      data: {
        user
      }
    })
  }

  async updateProfile({ id, updateProfileDto }: { id: string; updateProfileDto: UpdateProfileDto }) {
    try {
      const user = await this.usersService.findOne({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          address: true,
          birthday: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!user) {
        throw new NotFoundException('User not found') // Handle missing user
      }

      const dto = new UpdateProfileDto({
        address: updateProfileDto.address,
        birthday: updateProfileDto.birthday,
        name: updateProfileDto.name,
        avatar: updateProfileDto.avatar
      })

      await this.usersService.update(id, {
        ...dto,
        updatedAt: new Date()
      })

      return new ResponseData({
        message: 'Update profile successfully'
      })
    } catch (error) {
      throw error
    }
  }

  async getUserById(userId: string) {
    const user = await this.usersService.findOneBy({
      id: userId
    })

    return user
  }

  async getUserByEmail(email: string) {
    const user = await this.usersService.findOneBy({
      email
    })

    return user
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)

    return hash
  }

  async createAccessToken(payload: { userId: string; role: Role }) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET_ACCESS_TOKEN'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN_ACCESS_TOKEN')
    })
  }

  async createRefreshToken(payload: { userId: string; role: Role }) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET_REFRESH_TOKEN'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN_REFRESH_TOKEN')
    })
  }

  async createToken(payload: { userId: string; role: Role }) {
    const [access_token, refresh_token] = await Promise.all([
      await this.createAccessToken(payload),
      await this.createRefreshToken(payload)
    ])

    return {
      access_token,
      refresh_token
    }
  }

  async getGoogleToken(code: string) {
    const url = 'https://oauth2.googleapis.com/token'
    const body = {
      code,
      client_id: this.configService.get('GOOGLE_CLIENT_ID'),
      client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
      redirect_uri: this.configService.get('GOOGLE_REDIRECT_URI'),
      grant_type: 'authorization_code'
    }
    const res = await this.httpService.axiosRef.post(url, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return res.data
  }
}
