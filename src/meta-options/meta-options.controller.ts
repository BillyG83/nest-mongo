import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from './dtos/createPostMetaOptions.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @Post()
  public createMetaOption(
    @Body() createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    console.log('POST META OPTION');
    return this.metaOptionsService.create(createPostMetaOptionsDto);
  }
}
