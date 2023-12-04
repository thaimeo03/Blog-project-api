import { Module } from '@nestjs/common'
import { MediasController } from './medias.controller'
import { MediasService } from './medias.service'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ImagesModule } from 'src/images/images.module'

@Module({
  imports: [ConfigModule, ImagesModule, JwtModule],
  controllers: [MediasController],
  providers: [MediasService]
})
export class MediasModule {}
