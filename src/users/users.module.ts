import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  imports: [forwardRef(() => AuthModule)],
  providers: [UsersService],
})
export class UsersModule {}
