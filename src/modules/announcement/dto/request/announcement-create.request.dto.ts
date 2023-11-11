import {
  IsEnum,
  IsInt,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { CarBrandEnum } from '../../../../common/enum/car.brand.enum';
import { AllCarModelEnum } from '../../../../common/enum/model/allCar.model.enum';
import { CurrencyEnum } from '../../../../common/enum/сurrency.enum';

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
