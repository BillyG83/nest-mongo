import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/getUsersParam.dto';

@Injectable()
export class UsersService {
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit?: number,
    page?: number,
  ) {
    console.log({ UsersService: 'findAll', getUserParamDto, limit, page });

    return [
      {
        firstName: 'Bill',
        email: 'bill@gmail.com',
      },
      {
        firstName: 'Bianca',
        email: 'biance@gmail.com',
      },
      {
        firstName: 'Kate',
        email: 'kate@gmail.com',
      },
    ];
  }

  public finByOneById(id: string) {
    console.log({ finByOneById: id });

    return {
      id: 1,
      firstName: 'Bill',
      email: 'bill@gmail.com',
    };
  }
}
