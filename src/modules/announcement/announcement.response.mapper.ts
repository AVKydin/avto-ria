import { IList } from '../../common/interface/list.interface';
import { AnnouncementEntity } from '../../database/entities/announcement.entity';
import { AnnouncementDetailsResponseDto } from './dto/response/announcement-details.response.dto';

export class AnnouncementResponseMapper {
  constructor() {}

  static toListDto(data: IList<AnnouncementEntity>, query: any): any {
    return {
      data: data.entities.map(this.toDetailsDto),
      total: data.total,
      ...query,
    };
  }

  static toDetailsDto(
    data: AnnouncementEntity,
    allCurrency: any = null,
  ): AnnouncementDetailsResponseDto {
    if (allCurrency) {
      return {
        id: data.id,
        year: data.year,
        price: data.price,
        model: data.model,
        brand: data.brand,
        createdAt: data.createdAt,
        currency: data.currency,
        user: data.user?.id,
        priceUah: allCurrency.currencyUah,
        priceUsd: allCurrency.currencyUsd,
        priceEur: allCurrency.currencyEur,
      };
    } else {
      return {
        id: data.id,
        year: data.year,
        price: data.price,
        model: data.model,
        brand: data.brand,
        createdAt: data.createdAt,
        currency: data.currency,
        user: data.user?.id,
      };
    }
  }
  static toDetailsListDto(data: any[]): AnnouncementDetailsResponseDto[] {
    return data.map(this.toDetailsDto);
  }
}
