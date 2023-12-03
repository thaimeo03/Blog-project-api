import { Module } from '@nestjs/common'
import { MediasController } from './medias.controller'
import { MediasService } from './medias.service'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [ConfigModule, JwtModule],
  controllers: [MediasController],
  providers: [MediasService]
})
export class MediasModule {}
