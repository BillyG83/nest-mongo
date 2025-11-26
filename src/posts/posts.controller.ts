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

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  public getAllPosts() {
    return this.postService.getAll();
  }

  @Get(':userId')
  public getUserPosts(@Param('userId') userId: number) {
    return this.postService.getAllByUserId(userId);
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
