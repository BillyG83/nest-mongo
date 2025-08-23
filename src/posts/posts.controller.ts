import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from './dtos/createPost.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get(':userId')
  public getAllPosts(@Param('userId') userId: string) {
    return this.postService.getAll(userId);
  }

  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.newPost(createPostDto);
  }
}
