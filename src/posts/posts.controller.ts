import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './providers/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get(':userId')
  public getAllPosts(@Param('userId') userId: string) {
    return this.postService.getAll(userId);
  }
}
