import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    /**
     * Circular dependency between the user and auth services
     */
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    /**
     * Injecting user repository
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * The method to get all the users from the database
   */
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

  /**
   * The method to get a specific user by the user Id
   */
  public finByOneById(id: string) {
    console.log({ finByOneById: id });

    return {
      id: 1,
      firstName: 'Bill',
      email: 'bill@gmail.com',
      password: 'password1',
    };
  }

  /**
   * The method to create a new user in the users repository
   */
  public async createUser(createUserDto: CreateUserDto) {
    console.log('createUser');

    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    console.log({ existingUser });

    if (existingUser) {
      return console.log('user with his email exists');
    }

    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);
    return newUser;
  }
}
