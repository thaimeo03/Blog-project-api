import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, Delete, Body, UseGuards } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { MulterConfigService } from 'common/configs/multer.config'
import { MediasService } from './medias.service'
import { AuthGuard } from 'src/users/users.guard'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/users.enum'

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post('upload-image')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(FileInterceptor('image', new MulterConfigService('images').createMulterOptions()))
  uploadImageFile(@UploadedFile() file: Express.Multer.File) {
    return this.mediasService.uploadImage(file)
  }

  @Post('upload-images')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(FilesInterceptor('images', 3, new MulterConfigService('images').createMulterOptions())) // Max 3 files
  uploadImageFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.mediasService.uploadImages(files)
  }

  @Delete('delete-images')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  deleteImages(@Body() publicIds: string[]) {
    return this.mediasService.deleteImages(publicIds)
  }
}
