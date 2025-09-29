import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from '../dtos/createPostMetaOptions.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../meta-option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    // Inject metaOptionsRepository
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDto) {
    const metaOption = this.metaOptionsRepository.create(
      createPostMetaOptionsDto,
    );
    return await this.metaOptionsRepository.save(metaOption);
  }
}
