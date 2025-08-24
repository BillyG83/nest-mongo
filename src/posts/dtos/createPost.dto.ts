import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REVIEW = 'review',
  SCHEDULED = 'scheduled',
}

export enum PostType {
  PAGE = 'page',
  POST = 'post',
  SERIES = 'series',
  STORY = 'story',
}

export class CreatePostMetaOptionsDto {
  @ApiProperty({
    description: 'Metadata key name.',
    example: 'readingTime',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'Any JSON-serializable value.',
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' },
      { type: 'object' },
      { type: 'array', items: { type: 'string' } },
    ],
    example: 4,
  })
  @IsNotEmpty()
  value: any;
}

export class CreatePostDto {
  @ApiPropertyOptional({
    description: 'Rich-text or markdown body of the post.',
    example: 'Hello world! This is my first blog post.',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Absolute URL to the featured image.',
    example: 'https://cdn.example.com/images/post-123.jpg',
    format: 'uri',
  })
  @IsUrl()
  @IsOptional()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description:
      'Arbitrary metadata for the post as key/value pairs (JSON-serializable).',
    type: () => [CreatePostMetaOptionsDto],
    example: [
      { key: 'readingTime', value: 4 },
      { key: 'featured', value: true },
    ],
  })
  @IsArray()
  @Type(() => CreatePostMetaOptionsDto)
  @IsOptional()
  metaOptions?: [CreatePostMetaOptionsDto];

  @ApiProperty({
    description: 'Type of content represented by the post.',
    enum: PostType,
    enumName: 'PostType',
    example: PostType.POST,
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @ApiPropertyOptional({
    description: 'Publish timestamp in ISO 8601 format.',
    example: '2025-08-23T14:35:00+02:00',
    format: 'date-time',
  })
  @IsISO8601()
  @IsOptional()
  publishedOn?: string;

  @ApiPropertyOptional({
    description:
      'Stringified JSON (e.g., JSON-LD schema) to attach to the post.',
    example:
      '{"@context":"https://schema.org","@type":"BlogPosting","headline":"Blog Post Title"}',
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiProperty({
    description:
      'URL-friendly slug (letters, numbers, hyphens only; no spaces).',
    example: 'my-url',
    pattern: '^[A-Za-z0-9-]+$',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9-]+$/, {
    message:
      'slug should be only letters, numbers and hyphens with no spaces. EG: my-url',
  })
  slug: string;

  @ApiProperty({
    description: 'Publishing status of the post.',
    enum: PostStatus,
    enumName: 'PostStatus',
    example: PostStatus.DRAFT,
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  @ApiPropertyOptional({
    description:
      'Free-form tags associated with the post. Each tag must be at least 3 characters.',
    type: [String],
    example: ['nestjs', 'swagger', 'blog'],
  })
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: 'Blog Post Title',
    description: 'The title of the blog post',
    required: true,
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;
}
