import { Injectable } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from 'database/entities/post.entity'
import { Repository } from 'typeorm'
import { UsersService } from 'src/users/users.service'
import { ResponseData } from 'common/customs/responseData'
import { omit } from 'lodash'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsService: Repository<Post>,
    private readonly userService: UsersService
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

  findOne(id: number) {
    return `This action returns a #${id} post`
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`
  }

  remove(id: number) {
    return `This action removes a #${id} post`
  }
}
