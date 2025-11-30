import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}

  public async SignIn(signInDto: SignInDto): Promise<{
    accessToken: string;
  }> {
    const user = await this.userService.findOneByEmail(signInDto.email);
    let isEqual: boolean = false;

    if (!user?.password) {
      throw new RequestTimeoutException('Could not fetch users password');
    }

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user?.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      },
    );

    return {
      accessToken,
    };
  }
}
