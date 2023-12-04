import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from 'database/entities/post.entity'
import { Repository } from 'typeorm'
import { UsersService } from 'src/users/users.service'
import { ResponseData } from 'common/customs/responseData'
import { omit } from 'lodash'
import { MediasService } from 'src/medias/medias.service'
import { ImagesService } from 'src/images/images.service'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsService: Repository<Post>,
    private readonly userService: UsersService,
    private readonly imagesService: ImagesService,
    private readonly mediasService: MediasService
  ) {}

  async create({ createPostDto, userId }: { createPostDto: CreatePostDto; userId: string }) {
    try {
      const user = await this.userService.getUserById(userId)
      const post = await this.postsService.save({ ...createPostDto, user })
      return new ResponseData({
        message: 'Create post successfully',
        data: omit(post, ['user']) // Omit user field
      })
    } catch (error) {
      throw error
    }
  }

  findAll() {
    return `This action returns all posts`
  }

  async findOne(id: string) {
    return await this.postsService.findOne({
      where: {
        id
      }
    })
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`
  }

  async delete(id: string) {
    try {
      // Find existing post
      const post = await this.findOne(id)
      if (!post) {
        throw new NotFoundException('Post not found')
      }

      // Delete thumbnail image
      if (post.thumbnail) {
        const thumbnailInfo = await this.imagesService.getImageByUrl(post.thumbnail)
        await this.mediasService.deleteImages([thumbnailInfo.public_id])
      }

      // Delete post
      await this.postsService.delete(id)
      return new ResponseData({
        message: 'Delete post successfully'
      })
    } catch (error) {
      throw error
    }
  }
}
