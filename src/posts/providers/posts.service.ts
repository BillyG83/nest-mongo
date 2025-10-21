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

  public async getAll(userId?: string) {
    // if not set to 'eager' in the post.entity define the relationship
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
      },
    });
    if (!userId) return posts;
    const user = this.usersService.finByOneById(userId);
    if (!user) {
      console.error('use of posts not found');
    }

    // TODO save userId with post entity?
    const postsOfUser = posts.filter((post) => post.id === user.id);
    return postsOfUser;
  }

  public async create(@Body() createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);
    const result = await this.postsRepository.save(post);
    return result;
  }

  public async delete(id: number) {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post?.metaOptions) {
      return 'this post has no meta options';
    }
    const postFoundByMetaOptions = await this.metaOptionsRepository.find({
      where: { id: post?.metaOptions.id },
      relations: { post: true },
    });
    console.log(postFoundByMetaOptions);

    if (postFoundByMetaOptions) {
      return postFoundByMetaOptions;
    }
    await this.postsRepository.delete(id);
    if (!post) return 'post not found';
    return {
      deleted: true,
      postId: id,
      postTitle: post?.title,
    };
  }
}
