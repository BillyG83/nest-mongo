import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './paginationQuery.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { paginationDefaults } from './paginationDefaults';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from './paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginatedQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    // set up default fallbacks
    const page = paginatedQuery.page || paginationDefaults.page;
    const limit = paginatedQuery.limit || paginationDefaults.limit;

    // make query to repo that is passed
    const result = await repository.find({
      take: limit,
      skip: (page - 1) * limit,
    });

    // build urls for response
    const baseUrl = `${this.request.protocol}://${this.request.headers.host}/`;
    const newUrl = new URL(this.request.url, baseUrl);

    // calculate items
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page === totalPages ? page : page + 1;
    const prevPage = page === 1 ? page : page - 1;

    // return typed response
    const response: Paginated<T> = {
      data: result,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalItems,
        totalPages: totalItems,
      },
      links: {
        current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
        first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
        prev: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${prevPage}`,
      },
    };
    return response;
  }
}
