import { IsEnum, IsInt, IsString, Max, Min } from 'class-validator';

import { AllCarModelEnum } from '../../../../common/enum/model/allCar.model.enum';

export class AnnouncementCreateRequestDto {
  @IsInt()
  @Min(1970)
  @Max(new Date().getFullYear())
  year: number;

  @IsInt()
  price: number;

  @IsEnum(AllCarModelEnum)
  model: string;

  // @IsEnum(CarBrandEnum)
  @IsString()
  brand: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  // @IsEnum(CurrencyEnum)
  @IsString()
  currency: string;
}
