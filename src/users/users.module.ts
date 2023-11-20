import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'database/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule, ConfigModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
