import { BadRequestException, Injectable } from '@nestjs/common'
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private folderName: string) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      fileFilter(req, file, callback) {
        const ext = extname(file.originalname)

        const allowedExtensions = ['.png', '.jpg', '.jpeg']

        if (!allowedExtensions.includes(ext)) {
          return callback(
            new BadRequestException('Only images are allowed. Accepted extensions are png, jpg, jpeg'),
            false
          )
        }

        const fileSize = file.size
        if (fileSize > 5 * 1024 * 1024) {
          return callback(new BadRequestException('File is too large. Max file size is 5MB'), false)
        }

        callback(null, true)
      },
      storage: diskStorage({
        destination: `uploads/${this.folderName}`,
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`)
        }
      })
    }
  }
}
