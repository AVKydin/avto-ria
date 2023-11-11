import { AnnouncementEntity } from '../../../../database/entities/announcement.entity';
import { UserListQueryRequestDto } from '../request/user-list-query.request.dto';

export class UserListResponseDto extends UserListQueryRequestDto {
  data: UserListItemResponseDto[];
  total: number;
}

export class UserListItemResponseDto {
  id: string;
  userName: string;
  createdAt: Date;
  role: string;
  announcements: AnnouncementEntity[];
}
