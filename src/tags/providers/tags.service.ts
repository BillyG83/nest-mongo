import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/createTagDto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  public async getAll() {
    return await this.tagRepository.find();
  }

  public async create(createTagDto: CreateTagDto) {
    const newTag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(newTag);
  }

  public async findMultipleTags(tags?: number[]) {
    if (!tags) return null;
    const results = await this.tagRepository.find({ where: { id: In(tags) } });
    return results;
  }

  public async delete(id: number) {
    await this.tagRepository.delete(id);
    return {
      deleted: true,
      id,
    };
  }

  public async softDele(id: number) {
    await this.tagRepository.softDelete(id);
    return {
      softDeleted: true,
      id,
    };
  }
}
