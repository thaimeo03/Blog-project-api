import { Injectable } from '@nestjs/common'
import cloudinary from 'common/configs/cloudinary.config'
import { ResponseData } from 'common/customs/responseData'
import * as fs from 'fs'
import { ImagesService } from 'src/images/images.service'

@Injectable()
export class MediasService {
  constructor(private readonly imagesService: ImagesService) {}

  async uploadImage(file: Express.Multer.File) {
    try {
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: 'images'
      })

      // Delete the file in uploads folder
      fs.unlink(file.path, (err) => {
        if (err) throw err
      })

      // Store public_id and url in database
      await this.imagesService.createImages([
        {
          url: result.secure_url,
          public_id: result.public_id
        }
      ])

      return new ResponseData({
        message: 'Upload image successfully',
        data: {
          url: result.secure_url,
          public_id: result.public_id
        }
      })
    } catch (error) {
      throw error
    }
  }

  async uploadImages(files: Express.Multer.File[]) {
    try {
      const responseUploaded = await Promise.all(
        files.map(async (file) => {
          const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: 'images'
          })

          // Delete the file in uploads folder
          fs.unlink(file.path, (err) => {
            if (err) throw err
          })

          return result
        })
      )

      const results = responseUploaded.map((result) => {
        return {
          url: result.secure_url,
          public_id: result.public_id
        }
      })

      // Store public_id and url in database
      await this.imagesService.createImages(results)

      return new ResponseData({
        message: 'Upload images successfully',
        data: results
      })
    } catch (error) {
      throw error
    }
  }

  async deleteImages(publicIds: string[]) {
    try {
      await Promise.all(
        publicIds.map(async (publicId) => {
          await cloudinary.v2.uploader.destroy(publicId)
        })
      )

      // Delete from database
      await this.imagesService.deleteImagesByPublicIds(publicIds)

      return new ResponseData({
        message: 'Delete images successfully'
      })
    } catch (error) {
      throw error
    }
  }
}
