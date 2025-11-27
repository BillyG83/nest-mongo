import {
  BadRequestException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
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

    // private readonly configService: ConfigService,

    private readonly dataSource: DataSource,
  ) {}

  public async finByOneById(id?: number) {
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

  public async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
      if (existingUser) {
        throw new BadRequestException(
          `user with email ${existingUser?.email} already exists`,
          {},
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new RequestTimeoutException('The request was unsuccessful', {
        cause: error,
      });
    }

    let newUser = this.userRepository.create(createUserDto);
    try {
      newUser = await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to create new user in the database',
        {
          cause: error,
        },
      );
    }
  }
}
