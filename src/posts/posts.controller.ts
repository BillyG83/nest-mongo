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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
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
    return this.postService.getAll(userId);
  }

  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'Your post was created successfully',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @ApiOperation({
    summary: 'Update a blog post',
  })
  @ApiResponse({
    status: 200,
    description: 'Your post was updated successfully',
  })
  @Patch()
  public updatePost(@Body() patchPosts: PatchPostDto) {
    console.log(patchPosts);
  }

  @ApiOperation({
    summary: 'Delete a blog post',
  })
  @ApiResponse({
    status: 200,
    description: 'Your post was deleted successfully',
  })
  @Delete()
  public deletePost(@Query('id', ParseIntPipe) postId: number) {
    return this.postService.delete(postId);
  }
}
