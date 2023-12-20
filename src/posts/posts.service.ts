import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from 'database/entities/post.entity'
import { FindOptionsWhere, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm'
import { UsersService } from 'src/users/users.service'
import { ResponseData, ResponseDataWithPagination } from 'common/customs/responseData'
import { omit } from 'lodash'
import { MediasService } from 'src/medias/medias.service'
import { ImagesService } from 'src/images/images.service'
import { FilterPostDto } from './dto/filter-post.dto'

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

  async findAll(filterPostDto: FilterPostDto) {
    const { limit, page, title, createdAt, view } = filterPostDto
    const LIMIT_QUERY = 10
    const PAGE_QUERY = 1

    const limitQuery = limit ? limit : LIMIT_QUERY
    const pageQuery = page ? page : PAGE_QUERY

    // Define where query
    const whereQuery: FindOptionsWhere<Post> | FindOptionsWhere<Post>[] = {
      title: title ? Like(`%${title}%`) : undefined
    }

    // Get posts by filters
    const [posts, totalPosts] = await Promise.all([
      this.postsService.find({
        where: whereQuery,
        order: {
          createdAt: createdAt ? (createdAt === 'asc' ? 'ASC' : 'DESC') : 'DESC'
          // view: view ? (view === 'asc' ? 'ASC' : 'DESC') : undefined
        },
        take: limitQuery,
        skip: (pageQuery - 1) * limitQuery
      }),
      this.postsService.count({
        where: whereQuery
      })
    ])

    // Total page
    const total = Math.ceil(totalPosts / limitQuery)

    return new ResponseDataWithPagination({
      message: 'Get posts successfully',
      data: posts,
      pagination: {
        limit: Number(limitQuery),
        current_page: Number(pageQuery),
        total_page: total
      }
    })
  }

  async findOne(id: string) {
    const post = await this.postsService.findOne({
      where: {
        id
      }
    })

    if (!post) {
      throw new NotFoundException('Post not found')
    }
    return new ResponseData({
      message: 'Get post successfully',
      data: post
    })
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`
  }

  async delete(id: string) {
    try {
      // Find existing post
      const post = await this.postsService.findOne({
        where: {
          id
        }
      })
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
