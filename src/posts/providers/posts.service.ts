import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/createPost.dto';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}

  public getAll(userId: string) {
    console.log(userId);
    const user = this.usersService.finByOneById(userId);

    if (!user) return [];
    return [
      {
        content: 'Post 1 content',
        title: 'Post title 1',
        user,
      },
      {
        content: 'Post 2 content',
        title: 'Post title 2',
        user,
      },
      {
        content: 'Post 3 content',
        title: 'Post title 3',
        user,
      },
    ];
  }

  public newPost(newPost: CreatePostDto) {
    return { newPost };
  }
}
