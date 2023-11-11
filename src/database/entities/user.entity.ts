import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AccountTypeEnum } from '../../common/enum/model/accountType.enum';
import { AnnouncementEntity } from './announcement.entity';
import { CreatedUpdatedModel } from './common/created-updated.model';
import { RoleEntity } from './role.entity';

@Entity('user')
export class UserEntity extends CreatedUpdatedModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  userName: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  city: string;

  @Column({
    type: 'enum',
    enum: AccountTypeEnum,
    default: AccountTypeEnum.BASE,
    nullable: true,
  })
  accountType: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @OneToOne(() => RoleEntity, (entity) => entity.user)
  role: RoleEntity;

  @OneToMany(() => AnnouncementEntity, (entity) => entity.user)
  announcements: AnnouncementEntity[];
}
