import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from './dtos/createPost.dto';
import { PatchPostDto } from './dtos/patchPost.dto';
import { GetPostsDto } from './dtos/getPosts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  public getAllPosts(@Query() postQuery: GetPostsDto) {
    return this.postService.getAll(postQuery);
  }

  @Get(':userId')
  public getUserPosts(
    @Query() postQuery: GetPostsDto,
    @Param('userId') userId?: number,
  ) {
    return this.postService.getAllByUserId(postQuery, userId);
  }

  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Patch()
  public updatePost(@Body() patchPosts: PatchPostDto) {
    return this.postService.update(patchPosts);
  }

  @Delete()
  public deletePost(@Query('id', ParseIntPipe) postId: number) {
    return this.postService.delete(postId);
  }
}
