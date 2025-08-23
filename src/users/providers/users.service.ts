import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/getUsersParam.dto';
import { AuthService } from 'src/auth/providers/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public findAll(
    getUserParamDto?: GetUsersParamDto,
    limit?: number,
    page?: number,
  ) {
    console.log({ UsersService: 'findAll', getUserParamDto, limit, page });
    const isAuth = this.authService.isAuth();
    if (!isAuth) return 'no auth';

    return [
      {
        firstName: 'Bill',
        email: 'bill@gmail.com',
        password: 'password1',
      },
      {
        firstName: 'Bianca',
        email: 'biance@gmail.com',
        password: 'password1',
      },
      {
        firstName: 'Kate',
        email: 'kate@gmail.com',
        password: 'password1',
      },
    ];
  }

  public finByOneById(id: string) {
    console.log({ finByOneById: id });

    return {
      id: 1,
      firstName: 'Bill',
      email: 'bill@gmail.com',
      password: 'password1',
    };
  }
}
