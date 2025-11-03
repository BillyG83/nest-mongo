import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';

@Module({
  imports: [
    AuthModule,
    PostsModule,
    UsersModule,
    TagsModule,
    MetaOptionsModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        autoLoadEntities: true,
        database: 'nestjs-blog',
        host: 'localhost',
        password: 'bill',
        port: 5432,
        synchronize: true, // should not be true in prod
        type: 'postgres',
        username: 'postgres',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
