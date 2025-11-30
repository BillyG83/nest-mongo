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
import { User } from '../user.entity';
import { CreateMultiUsersDto } from '../dtos/createMultiUsers.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.service';

@Injectable()
export class MultiUsersProvider {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly PaginationProvider: PaginationProvider,
    private readonly dataSource: DataSource,
  ) {}

  public async findAll(limit?: number, page?: number) {
    try {
      const isAuth = this.authService.isAuth();
      if (!isAuth) {
        throw new BadRequestException(
          `you are not authenticated to make this request`,
          {},
        );
      }
      const users = await this.PaginationProvider.paginateQuery(
        { page, limit },
        this.userRepository,
      );

      return users;
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
