import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Max } from 'class-validator';
import { paginationDefaults } from './paginationDefaults';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @Max(50)
  limit?: number = paginationDefaults.limit;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number = paginationDefaults.page;
}
