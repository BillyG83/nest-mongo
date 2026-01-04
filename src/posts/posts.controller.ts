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
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/auth/decorators/activeUser.decorator';

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
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.postService.create(createPostDto, user.sub);
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
