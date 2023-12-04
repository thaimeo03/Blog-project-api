import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Image } from 'database/entities/image.entity'
import { Repository } from 'typeorm'
import { CreateImageDto } from './dto/create-image.dto'

@Injectable()
export class ImagesService {
  constructor(@InjectRepository(Image) private readonly imagesService: Repository<Image>) {}

  async createImages(images: CreateImageDto[]) {
    try {
      await this.imagesService.save(images)
    } catch (error) {
      throw error
    }
  }

  async getImageByUrl(url: string) {
    try {
      return await this.imagesService.findOne({ where: { url } })
    } catch (error) {
      throw error
    }
  }

  async deleteImagesByPublicIds(publicIds: string[]) {
    try {
      await Promise.all(
        publicIds.map(async (publicId) => {
          await this.imagesService.delete({ public_id: publicId })
        })
      )
    } catch (error) {
      throw error
    }
  }
}
