import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { CreatePostDto } from '../dtos/createPost.dto';
import { Post } from '../post.entity';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async getAll(userId?: number) {
    // if not set to 'eager' in the post.entity define the relationship
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
      },
    });
    console.log('to do filter posts by ' + userId);

    return posts;
  }

  public async create(@Body() createPostDto: CreatePostDto) {
    const author = await this.usersService.finByOneById(createPostDto.authorId);
    console.log({ author });

    if (!author) {
      return 'author not found';
    }
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
    });
    const result = await this.postsRepository.save(post);
    return result;
  }

  public async delete(id: number) {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) return 'post not found';

    if (!post?.metaOptions) {
      return 'this post has no meta options';
    }

    const metaOptionsOfPost = await this.metaOptionsRepository.findOne({
      where: { id: post.metaOptions.id },
      relations: { post: true },
    });

    await this.postsRepository.delete(id);

    if (isNotEmpty(metaOptionsOfPost) && metaOptionsOfPost?.id) {
      await this.metaOptionsRepository.delete(metaOptionsOfPost.id);
    }

    return {
      deleted: true,
      postId: id,
      postTitle: post?.title,
    };
  }
}
