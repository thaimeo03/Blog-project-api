import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { AuthGuard } from 'src/users/users.guard'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/users.enum'
import { Request } from 'express'
import { FilterPostDto } from './dto/filter-post.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const userId = req['user'].userId

    return this.postsService.create({ createPostDto, userId })
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  findAll(@Query() filterPostDto: FilterPostDto) {
    return this.postsService.findAll(filterPostDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  delete(@Param('id') id: string) {
    return this.postsService.delete(id)
  }
}
