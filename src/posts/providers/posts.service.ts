import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { CreatePostDto } from '../dtos/createPost.dto';
import { Post } from '../post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

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

  public async create(@Body() createPostDto: CreatePostDto) {
    const metaOptions = createPostDto.metaOptions
      ? this.metaOptionsRepository.create(createPostDto.metaOptions)
      : null;
    if (metaOptions) {
      await this.metaOptionsRepository.save(metaOptions);
    }

    const post = this.postsRepository.create(createPostDto);

    if (metaOptions) {
      post.metaOptions = metaOptions;
    }

    const result = await this.postsRepository.save(post);
    return result;
  }
}
