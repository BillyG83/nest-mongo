import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
// import { User } from './users/user.entity';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';

@Module({
  imports: [
    AuthModule,
    PostsModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        autoLoadEntities: true,
        database: 'nestjs-blog',
        // entities: [User],
        host: 'localhost',
        password: 'bill',
        port: 5432,
        synchronize: true, // should not be true in prod
        type: 'postgres',
        username: 'postgres',
      }),
    }),
    UsersModule,
    TagsModule,
    MetaOptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
