import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Tag } from './tag.entity';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/createTagDto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get()
  public getAll() {
    return this.tagService.getAll();
  }

  @Post()
  public create(@Body() createTagDto: CreateTagDto): Promise<Tag | null> {
    return this.tagService.create(createTagDto);
  }

  @Delete()
  public delete(@Query('id', ParseIntPipe) id: number) {
    return this.tagService.delete(id);
  }

  @Delete('soft')
  public softDelete(@Query('id', ParseIntPipe) id: number) {
    return this.tagService.softDele(id);
  }
}
