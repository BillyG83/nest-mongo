import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TagDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  @MinLength(3)
  name: string;

  @ApiPropertyOptional()
  @IsJSON()
  @IsOptional()
  schema: string;

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
  @MaxLength(256)
  slug: string;
}
