import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AllCarModelEnum } from '../../common/enum/model/allCar.model.enum';
import { CreatedUpdatedModel } from './common/created-updated.model';
import { UserEntity } from './user.entity';

@Entity('announcement')
export class AnnouncementEntity extends CreatedUpdatedModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  price: number;

  @Column({
    type: 'enum',
    enum: AllCarModelEnum,
  })
  model: string;

  @Column({ type: 'text', nullable: true })
  brand: string;

  // @Column({ type: 'enum', enum: CarBrandEnum })
  // brand: CarBrandEnum;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  currency: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  viewedAt: Date;

  @Column({ type: 'int', default: 0 })
  viewsCount: number;

  // @Column({ type: 'enum', enum: CurrencyEnum })
  // currency: CurrencyEnum;

  @ManyToOne(() => UserEntity, (entity) => entity.announcements)
  user: UserEntity;
}
