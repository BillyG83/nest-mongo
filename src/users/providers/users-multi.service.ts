import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { GetUsersParamDto } from '../dtos/getUsersParam.dto';
import { User } from '../user.entity';
import { CreateMultiUsersDto } from '../dtos/createMultiUsers.dto';

@Injectable()
export class MultiUsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly dataSource: DataSource,
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

  public async createMany(createMultiUsersDto: CreateMultiUsersDto) {
    const newUsers: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to instantiate queryRunner in createMany method',
        {
          cause: error,
        },
      );
    }

    try {
      for (const user of createMultiUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        try {
          const result = await queryRunner.manager.save(newUser);
          newUsers.push(result);
        } catch (error) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_ACCEPTABLE,
              response: `user with email: ${newUser.email} cannot be created as part of createMany`,
              filleName: 'users-multi.service.ts',
            },
            HttpStatus.NOT_ACCEPTABLE,
            {
              cause: error,
              description: 'This options object is not returned to the user',
            },
          );
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(
        'Unable to create multiple users in the database',
        {
          cause: error,
        },
      );
    } finally {
      await queryRunner.release();
    }

    return newUsers;
  }
}
