import { AnnouncementDetailsResponseDto } from '../../../announcement/dto/response/announcement-details.response.dto';

export class UserDetailsResponseDto {
  id: string;
  userName: string;
  email: string;
  avatar?: string;
  announcements?: AnnouncementDetailsResponseDto[];
  createdAt: Date;
  accountType: string;
}
