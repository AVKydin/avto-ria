import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnnouncementEntity } from '../../database/entities/announcement.entity';
import { UserModule } from '../user/user.module';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementRepository } from './announcement.repository';
import { AnnouncementService } from './announcement.service';

@Module({
  controllers: [AnnouncementController],
  imports: [
    TypeOrmModule.forFeature([AnnouncementEntity]),
    UserModule,
    PassportModule.register({
      defaultStrategy: 'bearer',
      property: 'user',
    }),
  ],
  providers: [AnnouncementService, AnnouncementRepository, JwtService],
  exports: [AnnouncementRepository],
})
export class AnnouncementModule {}
