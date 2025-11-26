import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/createPost.dto';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { MetaOptionsService } from 'src/meta-options/providers/meta-options.service';
import { PatchPostDto } from '../dtos/patchPost.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly metaOptionsService: MetaOptionsService,
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async getAll() {
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });
    return posts;
  }

  public async getAllByUserId(userId?: number) {
    // if not set to 'eager' in the post.entity define the relationship
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });
    const filteredPosts = posts.filter((post) => post.author.id === userId);
    return filteredPosts;
  }

  public async create(@Body() createPostDto: CreatePostDto) {
    const author = await this.usersService.finByOneById(createPostDto.authorId);
    if (!author) {
      return 'author not found';
    }
    const tags = await this.tagsService.findMultipleTags(
      createPostDto.tags || [],
    );
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags || [],
    });
    const result = await this.postsRepository.save(post);
    return result;
  }

  public async update(@Body() patchPostDto: PatchPostDto) {
    const tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    const post = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });

    if (!post) {
      return `No post found with ID ${patchPostDto.id}`;
    }

    post.content = patchPostDto.content ?? post?.content;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post?.featuredImageUrl;
    post.postType = patchPostDto.postType ?? post?.postType;
    post.publishedOn = patchPostDto.publishedOn ?? post?.publishedOn;
    post.schema = patchPostDto.schema ?? post?.schema;
    post.slug = patchPostDto.slug ?? post?.slug;
    post.status = patchPostDto.status ?? post?.status;
    post.title = patchPostDto.title ?? post?.title;

    if (tags) {
      post.tags = tags;
    }

    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) return 'post not found';

    if (!post?.metaOptions) {
      return 'this post has no meta options';
    }

    const metaOptionsOfPost = await this.metaOptionsService.findOne(
      post.metaOptions.id,
    );

    if (metaOptionsOfPost?.id) {
      await this.metaOptionsService.delete(metaOptionsOfPost?.id);
    }

    return {
      deleted: true,
      postId: id,
      postTitle: post?.title,
    };
  }
}
