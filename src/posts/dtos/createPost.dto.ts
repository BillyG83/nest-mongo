import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../enums/postStatus.enum';
import { PostType } from '../enums/postType.enum';
import { CreatePostMetaOptionsDto } from './createPostMetaOptions.dto';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsUrl()
  @IsOptional()
  featuredImageUrl?: string;

  @IsArray()
  @Type(() => CreatePostMetaOptionsDto)
  @IsOptional()
  metaOptions?: [CreatePostMetaOptionsDto];

  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @IsISO8601()
  @IsOptional()
  publishedOn?: string;

  @IsJSON()
  @IsOptional()
  schema?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9-]+$/, {
    message:
      'slug should be only letters, numbers and hyphens with no spaces. EG: my-url',
  })
  slug: string;

  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;
}
