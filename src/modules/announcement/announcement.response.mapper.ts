import { IList } from '../../common/interface/list.interface';
import { AnnouncementEntity } from '../../database/entities/announcement.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { UserListQueryRequestDto } from '../user/dto/request/user-list-query.request.dto';
import { UserListResponseDto } from '../user/dto/response/user-list.response.dto';
import { AnnouncementDetailsResponseDto } from './dto/response/announcement-details.response.dto';

export class AnnouncementResponseMapper {
  static toListDto(data: IList<AnnouncementEntity>, query: any): any {
    // console.log(data.entities.map((value) => value.user));
    return {
      data: data.entities.map(this.toDetailsDto),
      total: data.total,
      ...query,
    };
  }
  static toDetailsDto(
    data: AnnouncementEntity,
  ): AnnouncementDetailsResponseDto {
    return {
      id: data.id,
      year: data.year,
      price: data.price,
      model: data.model,
      brand: data.brand,
      createdAt: data.createdAt,
      currency: data.currency,
      user: data.user.id,
    };
  }
  static toDetailsListDto(data: any[]): AnnouncementDetailsResponseDto[] {
    return data.map(this.toDetailsDto);
  }
}
