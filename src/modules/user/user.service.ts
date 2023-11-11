import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import * as bcrypt from 'bcrypt';
import { EntityManager } from 'typeorm';

import { AccountTypeEnum } from '../../common/enum/model/accountType.enum';
import { RoleEnum } from '../../common/enum/role.enum';
import { IList } from '../../common/interface/list.interface';
import { CustomConfigService } from '../../config/config.service';
import { RoleEntity } from '../../database/entities/role.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { UserCreateRequestDto } from './dto/request/user-create.request.dto';
import { UserListQueryRequestDto } from './dto/request/user-list-query.request.dto';
import { UserLoginRequestDto } from './dto/request/user-login.request.dto';
import { UserUpdateRequestDto } from './dto/request/user-update.request.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private salt = 5;

  constructor(
    private readonly customConfigService: CustomConfigService,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    @InjectRedisClient() readonly redisClient: RedisClient,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  public async createUser(dto: UserCreateRequestDto): Promise<UserEntity> {
    return await this.entityManager.transaction(async (em) => {
      const userRepository = em.getRepository(UserEntity);
      const userRoleRepository = em.getRepository(RoleEntity);

      const findUser = await userRepository.findOneBy({
        email: dto.email,
      });
      if (findUser) {
        throw new BadRequestException('User already exist');
      }
      const password = await bcrypt.hash(dto.password, this.salt);

      const userCreate = userRepository.create({ ...dto, password });

      const user = await userRepository.save(userCreate);

      await userRoleRepository.save(
        userRoleRepository.create({ role: RoleEnum.SELLER, user }),
      );

      return await userRepository.findOne({
        where: { id: user.id },
        relations: { announcements: true, role: true },
      });
    });
  }

  public async getAllUsers(
    query: UserListQueryRequestDto,
  ): Promise<IList<UserEntity>> {
    return await this.userRepository.getAllUsers(query);
  }

  public async getUserById(userId: string): Promise<UserEntity> {
    await this.findUserByIdOrException(userId);
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: { announcements: true },
    });
  }

  public async updateUserById(
    userId: string,
    body: UserUpdateRequestDto,
  ): Promise<UserEntity> {
    const entity = await this.findUserByIdOrException(userId);
    if (entity.email) {
      throw new BadRequestException('email is not allowed to be changed');
    }
    this.userRepository.merge(entity, body);
    return await this.userRepository.save(entity);
  }

  public async deleteUser(userId: string): Promise<void> {
    const entity = await this.findUserByIdOrException(userId);

    await this.userRepository.remove(entity);
  }

  private async findUserByIdOrException(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnprocessableEntityException('User entity not found');
    }
    return user;
  }

  async login(data: UserLoginRequestDto): Promise<{ token: string }> {
    const findUser = await this.userRepository.findOneBy({ email: data.email });
    if (!findUser) {
      throw new UnauthorizedException('Email or password is not correct');
    }

    const isCompare = await bcrypt.compare(data.password, findUser.password);
    if (!isCompare) {
      throw new UnauthorizedException('Email or password is not correct');
    }

    const token = await this.authService.signIn({
      id: findUser.id,
      role: findUser.role,
      accountType: findUser.accountType,
    });

    await this.redisClient.setEx(token, 10000, token);

    return { token };
  }

  async buyPremiumType(token: string): Promise<any> {
    const decodeToken = await this.authService.decode(token);
    const userId = decodeToken?.['id'];
    const user = await this.userRepository.findOneBy({ id: userId });
    user.accountType = AccountTypeEnum.PREMIUM;
    return await this.userRepository.save(user);
  }
}
