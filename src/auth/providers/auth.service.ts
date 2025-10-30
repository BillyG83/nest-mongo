import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  public async login(email: string, password: string, id: number) {
    const user = await this.userService.finByOneById(id);
    if (!user) return 'user no in database';
    if (user.email !== email) return 'users email mismatch';
    if (user.password !== password) return 'user password mismatch';
    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}
