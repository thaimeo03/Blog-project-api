import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { MulterConfigService } from 'common/configs/multer.config'

@Controller('medias')
export class MediasController {
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', new MulterConfigService('images').createMulterOptions()))
  uploadImageFile(@UploadedFile() file: Express.Multer.File) {
    return file.path
  }

  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('images', 3, new MulterConfigService('images').createMulterOptions())) // Max 3 files
  uploadImageFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const filePaths = files.map((file) => file.path)
    return filePaths
  }
}
