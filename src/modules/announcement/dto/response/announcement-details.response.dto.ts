import { UserEntity } from "../../../../database/entities/user.entity";


export class AnnouncementDetailsResponseDto {
  id: string;
  year: number;
  price: number;
  model: string;
  brand: string;
  createdAt: Date;
  currency: string;
  user: string;
}
