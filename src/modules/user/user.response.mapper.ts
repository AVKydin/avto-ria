import { IList } from '../../common/interface/list.interface';
import { UserEntity } from '../../database/entities/user.entity';
import { AnnouncementResponseMapper } from '../announcement/announcement.response.mapper';
import { UserListQueryRequestDto } from './dto/request/user-list-query.request.dto';
import { UserListResponseDto } from './dto/response/user-list.response.dto';
import { AnnouncementEntity } from "../../database/entities/announcement.entity";

export class UserResponseMapper {
  static toListDto(
    data: IList<UserEntity>,
    query: UserListQueryRequestDto,
  ): UserListResponseDto {
    return {
      data: data.entities.map(this.toListItemDto),
      total: data.total,
      ...query,
    };
  }

  static toListItemDto(data: UserEntity): any {
    return {
      id: data.id,
      userName: data.userName,
      createdAt: data.createdAt,
      role: data.role,
      announcements: data.announcements,
    };
  }

  static toDetailsDto(data: UserEntity): any {
    return {
      id: data.id,
      userName: data.userName,
      email: data.email,
      avatar: data.avatar,
      role: data.role ? data.role.role : null,
      password: data.password,
      createdAt: data.createdAt,
      announcements: data.announcements
        ? AnnouncementResponseMapper.toDetailsListDto(data.announcements)
        : null,
    };
  }
}
