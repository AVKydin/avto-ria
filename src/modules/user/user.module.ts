import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@webeleon/nestjs-redis';

import { CustomConfigModule } from '../../config/config.module';
import { redisConfig } from '../../config/redis.config';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    RedisModule.forRootAsync(redisConfig),
    CustomConfigModule,
    PassportModule.register({
      defaultStrategy: 'bearer',
      property: 'user',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, CustomConfigModule, JwtService],
  exports: [UserRepository],
})
export class UserModule {}
