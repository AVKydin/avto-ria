import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@webeleon/nestjs-redis';

import { CustomConfigModule } from '../../config/config.module';
import { CustomConfigService } from '../../config/config.service';
import { redisConfig } from '../../config/redis.config';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BearerStrategy } from './bearer.strategy';

@Module({
  imports: [
    CustomConfigModule,
    PassportModule.register({
      defaultStrategy: 'bearer',
      property: 'user',
    }),
    RedisModule.forRootAsync(redisConfig),
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [CustomConfigModule],
      useFactory: async (customConfigService: CustomConfigService) => ({
        secret: customConfigService.jwt_secret,
        signOptions: {
          expiresIn: customConfigService.jwt_expiresIn,
        },
      }),
      inject: [CustomConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BearerStrategy],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
