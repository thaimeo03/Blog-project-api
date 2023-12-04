import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from 'database/entities/post.entity'
import { UsersModule } from 'src/users/users.module'
import { ImagesModule } from 'src/images/images.module'
import { MediasService } from 'src/medias/medias.service'

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule, ImagesModule, JwtModule, ConfigModule],
  controllers: [PostsController],
  providers: [PostsService, MediasService]
})
export class PostsModule {}
