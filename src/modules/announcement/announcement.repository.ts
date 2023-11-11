import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { IList } from '../../common/interface/list.interface';
import { AnnouncementEntity } from '../../database/entities/announcement.entity';
import { UserListQueryRequestDto } from '../user/dto/request/user-list-query.request.dto';
import { UserListOrderFieldEnum } from '../user/enum/user-list-order-field.enum';

@Injectable()
export class AnnouncementRepository extends Repository<AnnouncementEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AnnouncementEntity, dataSource.manager);
  }

  public async getAllAnnouncement(
    query: UserListQueryRequestDto,
  ): Promise<IList<AnnouncementEntity>> {
    const queryBuilder = this.createQueryBuilder(
      'announcement',
    ).leftJoinAndSelect('announcement.user', 'user');

    switch (query.orderBy) {
      case UserListOrderFieldEnum.createdAt:
        queryBuilder.orderBy('announcement.createdAt', query.order);
        break;
      case UserListOrderFieldEnum.announcements:
        queryBuilder.orderBy('announcement.announcements', query.order);
        break;
    }

    if (query.search) {
      queryBuilder.andWhere('LOWER(announcement.brand) LIKE :search', {
        search: `%${query.search}%`,
      });
    }

    queryBuilder.limit(query.limit);
    queryBuilder.offset(query.offset);

    const [entities, total] = await queryBuilder.getManyAndCount();
    return { entities, total };
  }
}
