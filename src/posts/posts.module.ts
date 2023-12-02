import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from 'database/entities/post.entity'
import { User } from 'database/entities/user.entity'
import { UsersService } from 'src/users/users.service'

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), JwtModule, ConfigModule],
  controllers: [PostsController],
  providers: [PostsService, UsersService]
})
export class PostsModule {}
