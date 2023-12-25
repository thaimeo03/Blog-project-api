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
    const { title, createdAt, limitQuery, pageQuery } = this.postPagination(filterPostDto)

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
        relations: ['user'],
        select: {
          user: {
            id: true,
            name: true,
            avatar: true
          }
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

  async findAllByAuthor({ userId, filterPostDto }: { userId: string; filterPostDto: FilterPostDto }) {
    const { title, createdAt, limitQuery, pageQuery } = this.postPagination(filterPostDto)

    const whereQuery: FindOptionsWhere<Post> | FindOptionsWhere<Post>[] = {
      user: { id: userId },
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
        relations: ['user'],
        select: {
          user: {
            id: true,
            name: true,
            avatar: true
          }
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
      message: 'Get my posts successfully',
      data: posts,
      pagination: {
        limit: Number(limitQuery),
        current_page: Number(pageQuery),
        total_page: total
      }
    })
  }

  async findOne(id: string) {
    // Find one post and author
    const postWithAuthor = await this.postsService
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .select(['post', 'user.id', 'user.name', 'user.avatar'])
      .where('post.id = :id', { id })
      .getOne()

    if (!postWithAuthor) {
      throw new NotFoundException('Post not found')
    }
    return new ResponseData({
      message: 'Get post successfully',
      data: postWithAuthor
    })
  }

  async update({ id, userId, updatePostDto }: { id: string; userId: string; updatePostDto: UpdatePostDto }) {
    try {
      const post = await this.postsService
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .select(['post', 'user.id'])
        .where('post.id = :id and user.id = :userId', { id, userId })
        .getOne()

      if (!post) {
        throw new NotFoundException('Post not found') // Handle missing post
      }

      const dto = new UpdatePostDto({
        title: updatePostDto.title,
        thumbnail: updatePostDto.thumbnail,
        content: updatePostDto.content
      })

      await this.postsService.update(id, {
        ...dto,
        updatedAt: new Date() // Update time of last update
      })

      return new ResponseData({
        message: 'Update post successfully'
      })
    } catch (error) {
      throw error
    }
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

  postPagination(filterPostDto: FilterPostDto) {
    const { limit, page, title, createdAt, view } = filterPostDto
    const LIMIT_QUERY = 10
    const PAGE_QUERY = 1

    const limitQuery = limit ? limit : LIMIT_QUERY
    const pageQuery = page ? page : PAGE_QUERY

    return {
      title,
      createdAt,
      limitQuery,
      pageQuery
    }
  }
}
