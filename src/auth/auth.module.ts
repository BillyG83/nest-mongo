import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';

@Module({
  controllers: [AuthController],
  exports: [AuthService, HashingProvider],
  imports: [forwardRef(() => UsersModule)],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
})
export class AuthModule {}
