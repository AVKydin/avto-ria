import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { AccountTypeEnum } from '../../common/enum/model/accountType.enum';
import { IList } from '../../common/interface/list.interface';
import { AnnouncementEntity } from '../../database/entities/announcement.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { UserListQueryRequestDto } from '../user/dto/request/user-list-query.request.dto';
import { AnnouncementRepository } from './announcement.repository';
import { CurrencyConversionService } from './currency.conversion.service';
import { AnnouncementCreateRequestDto } from './dto/request/announcement-create.request.dto';
import { AnnouncementUpdateRequestDto } from './dto/request/announcement-update.request.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Filter = require('bad-words');

@Injectable()
export class AnnouncementService {
  private filter = new Filter();
  private count = 0;
  constructor(
    private readonly jwtService: JwtService,
    private readonly announcementRepository: AnnouncementRepository,
    private readonly currencyConversionService: CurrencyConversionService,
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

      if (this.count === 2) {
        throw new HttpException(
          'Ви використали три спроби розмістити оголошення. Якщо Ви впевнені у відсутності нецензурної лексики у Вашому оголошенні, то звірніться до менеджера для перевірки',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Перевірка на bad-words в заголовку та описі оголошення. Працює тільки з англійською лексикою
      if (
        this.filter.isProfane(body?.title) ||
        this.filter.isProfane(body?.description)
      ) {
        ++this.count;
        throw new HttpException(
          'Оголошення містить нецензурну лексику. Будь ласка, виправте текст.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const userId = decodeToken?.['id'];
      const accountType = decodeToken?.['accountType'];

      const user = await userRepository.findOne({
        where: { id: userId },
        relations: { announcements: true },
      });

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

  public async getAnnouncementById(announcementId: string): Promise<any> {
    const announcement =
      await this.findAnnouncementByIdOrException(announcementId);
    const allCurrency = await this.currencyConversionService.getExchangeRate(
      announcement.currency,
      announcement.price,
    );
    return { announcement, allCurrency };
  }

  public async updateCarById(
    announcementId: string,
    body: AnnouncementUpdateRequestDto,
  ): Promise<AnnouncementEntity> {
    const entity = await this.findAnnouncementByIdOrException(announcementId);
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
    const announcement = await this.announcementRepository.findOne({
      where: { id: announcementId },
      relations: { user: true },
    });
    if (!announcement) {
      throw new UnprocessableEntityException('announcement entity not found');
    }
    return announcement;
  }
}
