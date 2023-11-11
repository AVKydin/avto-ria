import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { UserBaseRequestDto } from './user-base.request.dto';

export class UserLoginRequestDto extends PickType(UserBaseRequestDto, [
  'email',
  'password',
]) {}

export class UserLoginGoogleRequestDto extends PickType(UserBaseRequestDto, [
  'email',
]) {
  @IsString()
  accessToken: string;
}
