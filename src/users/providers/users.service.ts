import {
  BadRequestException,
  HttpException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/createUser.dto';
import { User } from '../user.entity';
import { CreateUserProvider } from './create-user.provider';
import { MultiUsersProvider } from './users-multi.provider';
import { CreateMultiUsersDto } from '../dtos/createMultiUsers.dto';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { Paginated } from 'src/common/pagination/paginated.interface';

/**
 * Class to connect users table and perform business operations
 * @class
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly createUserProvider: CreateUserProvider,
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
    private readonly multiUserProvider: MultiUsersProvider,
  ) {}

  public async finByOneById(id?: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({
        id,
      });
      if (!user) {
        throw new BadRequestException(`no user of Id ${id} was found`, {});
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new RequestTimeoutException('The request was unsuccessful', {
        cause: error,
      });
    }
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return this.findUserByEmailProvider.findUserByEmail(email);
  }

  public async findAll(
    limit?: number,
    page?: number,
  ): Promise<Paginated<User>> {
    return this.multiUserProvider.findAll(limit, page);
  }

  public async createManyUsers(
    createMultiUsersDto: CreateMultiUsersDto,
  ): Promise<User[]> {
    return this.multiUserProvider.createMany(createMultiUsersDto);
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.createUserProvider.createUser(createUserDto);
  }
}
