import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../../../common/dto/pagination.query.dto';
import { OrderEnum } from '../../../../common/enum/order.enum';
import { UserListOrderFieldEnum } from '../../enum/user-list-order-field.enum';

export class UserListQueryRequestDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(OrderEnum)
  order?: OrderEnum = OrderEnum.ASC;

  @IsOptional()
  @IsEnum(UserListOrderFieldEnum)
  orderBy?: UserListOrderFieldEnum = UserListOrderFieldEnum.createdAt;

  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  @IsOptional()
  search?: string;
}
