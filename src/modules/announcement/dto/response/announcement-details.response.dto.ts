export class AnnouncementDetailsResponseDto {
  id: string;
  year: number;
  price: number;
  model: string;
  brand: string;
  createdAt: Date;
  currency: string;
  user?: string;
  priceUah?: number;
  priceUsd?: number;
  priceEur?: number;
  rateUsd?: number;
  rateEur?: number;
}
