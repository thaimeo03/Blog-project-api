import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from 'database/data-source'
import { PostsModule } from './posts/posts.module'
import { MediasModule } from './medias/medias.module'
import { ImagesModule } from './images/images.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(dataSourceOptions), UsersModule, PostsModule, MediasModule, ImagesModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
