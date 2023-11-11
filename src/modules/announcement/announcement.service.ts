import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AST } from 'eslint';
import { DecodeOptions } from 'jsonwebtoken';
import { EntityManager } from 'typeorm';

import { AccountTypeEnum } from '../../common/enum/model/accountType.enum';
import { RoleEnum } from '../../common/enum/role.enum';
import { IList } from '../../common/interface/list.interface';
import { AnnouncementEntity } from '../../database/entities/announcement.entity';
import { RoleEntity } from '../../database/entities/role.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { BearerStrategy } from '../auth/bearer.strategy';
import { UserListQueryRequestDto } from '../user/dto/request/user-list-query.request.dto';
import { UserRepository } from '../user/user.repository';
import { AnnouncementRepository } from './announcement.repository';
import { AnnouncementCreateRequestDto } from './dto/request/announcement-create.request.dto';
import { AnnouncementUpdateRequestDto } from './dto/request/announcement-update.request.dto';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly announcementRepository: AnnouncementRepository,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  public async createAnnouncement(
    body: AnnouncementCreateRequestDto,
    token: string,
  ): Promise<any> {
    return await this.entityManager.transaction(async (em) => {
      const userRepository = em.getRepository(UserEntity);
      const announcementRepository = em.getRepository(AnnouncementEntity);
      const decodeToken = this.jwtService.decode(token);

      console.log(decodeToken);

      const userId = decodeToken?.['id'];
      const accountType = decodeToken?.['accountType'];

      const user = await userRepository.findOne({
        where: { id: userId },
        relations: { announcements: true },
      });

      console.log(user);
      if (
        accountType === AccountTypeEnum.BASE &&
        user.announcements.length >= 1
      ) {
        throw new HttpException(
          'You have already placed one ad. To place several ads, you need to purchase a "premium" account type',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newAnnouncement = announcementRepository.create({
        ...body,
        user,
      });
      return await this.announcementRepository.save(newAnnouncement);
    });
  }

  public async getAllAnnouncement(
    query: UserListQueryRequestDto,
  ): Promise<IList<AnnouncementEntity>> {
    return await this.announcementRepository.getAllAnnouncement(query);
  }

  public async getAnnouncementById(
    announcementId: string,
  ): Promise<AnnouncementEntity> {
    return await this.findAnnouncementByIdOrException(announcementId);
  }

  public async updateCarById(
    announcementId: string,
    body: AnnouncementUpdateRequestDto,
  ): Promise<AnnouncementEntity> {
    const entity = await this.findAnnouncementByIdOrException(announcementId);
    // if (entity.email) {
    //   throw new BadRequestException("email is not allowed to be changed");
    // }
    this.announcementRepository.merge(entity, body);
    return await this.announcementRepository.save(entity);
  }

  public async deleteCar(announcementId: string): Promise<void> {
    const entity = await this.findAnnouncementByIdOrException(announcementId);
    await this.announcementRepository.remove(entity);
  }

  private async findAnnouncementByIdOrException(
    announcementId: string,
  ): Promise<AnnouncementEntity> {
    const car = await this.announcementRepository.findOneBy({
      id: announcementId,
    });
    if (!car) {
      throw new UnprocessableEntityException('announcement entity not found');
    }
    return car;
  }
}
