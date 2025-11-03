import { Body, Controller, Post } from '@nestjs/common';
import { Tag } from './tag.entity';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/createTagDto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Post()
  public createTag(@Body() createTagDto: CreateTagDto): Promise<Tag | null> {
    return this.tagService.create(createTagDto);
  }
}
