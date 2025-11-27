import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { GetUsersParamDto } from '../dtos/getUsersParam.dto';
import { CreateUserDto } from '../dtos/createUser.dto';
import { User } from '../user.entity';

/**
 * Class to connect users table and perform business operations
 * @class
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly configService: ConfigService,
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

  public async finByOneById(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    return user;
  }

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      return console.log('user with his email exists');
    }

    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);
    return newUser;
  }
}
