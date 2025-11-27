import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
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

    try {
      const isAuth = this.authService.isAuth();
      if (!isAuth) {
        throw new BadRequestException(
          `you are not authenticated to make this request`,
          {},
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.NOT_IMPLEMENTED,
          response: 'API not created yet',
          filleName: 'users.service.ts',
        },
        HttpStatus.NOT_IMPLEMENTED,
        {
          cause: new Error(),
          description: 'This options object is not returned to the user',
        },
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new RequestTimeoutException('The request was unsuccessful', {
        cause: error,
      });
    }
  }

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
