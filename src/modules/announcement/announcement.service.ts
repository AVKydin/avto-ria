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
import { UserRepository } from '../user/user.repository';
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
    private readonly userRepository: UserRepository,
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

  public async updateAnnouncementById(
    announcementId: string,
    body: AnnouncementUpdateRequestDto,
  ): Promise<AnnouncementEntity> {
    const entity = await this.findAnnouncementByIdOrException(announcementId);
    this.announcementRepository.merge(entity, body);
    return await this.announcementRepository.save(entity);
  }

  public async deleteAnnouncement(announcementId: string): Promise<void> {
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

  public async infoAnnouncement(token: string) {
    try {
      const decodeToken = this.jwtService.decode(token);
      const accountType = decodeToken?.['accountType'];
      const userId = decodeToken?.['id'];
      if (accountType === AccountTypeEnum.BASE) {
        throw new HttpException(
          'You need to purchase a "premium" account type',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['announcements'],
      });
      const userCity = user.city;

      const averagePriceByCity = await this.announcementRepository
        .createQueryBuilder('announcement')
        .innerJoin('announcement.user', 'user')
        .select('AVG(announcement.price)', 'average_price')
        .addSelect('"announcement"."model"', 'car_model')
        .where('user.city = :userCity', { userCity })
        .groupBy('"announcement"."model"')
        .getRawMany();

      // return averagePriceByCity;
      const averagePriceInUkraine = await this.announcementRepository
        .createQueryBuilder('announcement')
        .innerJoin('announcement.user', 'user')
        .select('AVG(announcement.price)', 'average_price')
        .addSelect('"announcement"."model"', 'car_model') // Додаємо модель як колонку для групування
        .groupBy('"announcement"."model"') // Групуємо за моделлю
        .getRawMany();

      const numberOfViews = await this.announcementRepository
        .createQueryBuilder('announcement')
        .select([
          'SUM(announcement.viewsCount) AS totalViews',
          "SUM(CASE WHEN DATE_TRUNC('day', announcement.createdAt) = CURRENT_DATE THEN announcement.viewsCount ELSE 0 END) AS viewsToday",
          "SUM(CASE WHEN DATE_TRUNC('week', announcement.createdAt) = CURRENT_DATE THEN announcement.viewsCount ELSE 0 END) AS viewsThisWeek",
          "SUM(CASE WHEN DATE_TRUNC('month', announcement.createdAt) = CURRENT_DATE THEN announcement.viewsCount ELSE 0 END) AS viewsThisMonth",
        ])
        .getRawOne();

      return {
        averagePriceByCity,
        averagePriceInUkraine,
        numberOfViews,
      };
    } catch (error) {
      throw new Error(error);
    }

    //   const decodeToken = this.jwtService.decode(token);
    //   const accountType = decodeToken?.['accountType'];
    //   const userId = decodeToken?.['id'];
    //   if (accountType === AccountTypeEnum.BASE) {
    //     throw new HttpException(
    //       'You need to purchase a "premium" account type',
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    //
    //   const user = await this.userRepository.findOne({
    //     where: { id: userId },
    //     relations: ['announcements'],
    //   });
    //
    //   const { city } = user;
    //
    //   const resultPriceByRegion = await this.announcementRepository
    //     .createQueryBuilder('announcement')
    //     .select(['model', 'user.city', 'AVG(price) AS average_price'])
    //     .leftJoin('announcement.user', 'user')
    //     .groupBy('model, user.city')
    //     .getRawMany();
    //   console.log(resultPriceByRegion);
    //   return resultPriceByRegion
    //     ? parseFloat(resultPriceByRegion.av)
    //     : null;
  }

  async incrementViewsCount(announcementId: string): Promise<void> {
    await this.announcementRepository
      .createQueryBuilder()
      .update(AnnouncementEntity)
      .set({
        viewsCount: () => 'viewsCount + 1',
      })
      .where('id = :id', { id: announcementId })
      .execute();
  }
}
