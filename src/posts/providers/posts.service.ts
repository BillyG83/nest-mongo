import {
  BadRequestException,
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/createPost.dto';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { MetaOptionsService } from 'src/meta-options/providers/meta-options.service';
import { PatchPostDto } from '../dtos/patchPost.dto';
import { GetPostsDto } from '../dtos/getPosts.dto';
import { paginationDefaults } from 'src/common/pagination/paginationDefaults';
import { PaginationProvider } from 'src/common/pagination/pagination.service';
import { Paginated } from 'src/common/pagination/paginated.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly metaOptionsService: MetaOptionsService,
    private readonly paginationProvider: PaginationProvider,
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async getAll(postQuery: GetPostsDto): Promise<Paginated<Post>> {
    const page = postQuery.page || paginationDefaults.page;
    const limit = postQuery.limit || paginationDefaults.limit;

    try {
      const posts = await this.paginationProvider.paginateQuery(
        {
          page,
          limit,
        },
        this.postsRepository,
      );
      return posts;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new RequestTimeoutException('The request was unsuccessful', {
        cause: error,
      });
    }
  }

  public async getAllByUserId(postQuery: GetPostsDto, userId?: number) {
    const page = postQuery.page || paginationDefaults.page;
    const limit = postQuery.limit || paginationDefaults.limit;

    try {
      const posts = await this.postsRepository.find({
        where: {
          author: {
            id: userId,
          },
        },
        relations: {
          metaOptions: true,
          author: true,
          tags: true,
        },
        take: postQuery.limit,
        skip: (page - 1) * limit,
      });
      if (posts.length === 0 || !posts) {
        throw new BadRequestException(
          `No posts found for user with Id: ${userId} were found`,
        );
      }
      return posts;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new RequestTimeoutException('The request was unsuccessful', {
        cause: error,
      });
    }
  }

  public async create(@Body() createPostDto: CreatePostDto) {
    try {
      const author = await this.usersService.finByOneById(
        createPostDto.authorId,
      );
      if (!author) {
        throw new BadRequestException(
          `No author was found, user with Id: ${createPostDto.authorId}`,
        );
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
      if (!result) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            response: 'Unable to save post',
            filleName: 'posts.service.ts',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
          {
            cause: new Error(),
            description: 'this.postsRepository.save(post) failed',
          },
        );
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new RequestTimeoutException('The request was unsuccessful', {
        cause: error,
      });
    }
  }

  public async update(@Body() patchPostDto: PatchPostDto) {
    const tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    if (tags?.length !== patchPostDto.tags) {
      throw new BadRequestException(
        'Tags have been requested that do not exist',
      );
    }

    try {
      const post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });

      if (!post) {
        throw new BadRequestException(
          `No post found with ID ${patchPostDto.id}`,
        );
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new RequestTimeoutException('The request was unsuccessful', {
        cause: error,
      });
    }
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
