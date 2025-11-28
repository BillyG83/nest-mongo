import { Module } from '@nestjs/common';
import { PaginationProvider } from './pagination.service';

@Module({
  providers: [PaginationProvider],
  exports: [PaginationProvider],
})
export class PaginationModule {}
