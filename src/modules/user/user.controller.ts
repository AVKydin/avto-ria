import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { diskStorage } from 'multer';

import { RoleDecorator } from '../../common/decorator/role.decorator';
import { RoleEnum } from '../../common/enum/role.enum';
import { LogoutGuard } from '../../common/guard/logout.guard';
import { RoleGuard } from '../../common/guard/role.guard';
import {
  editFileName,
  imageFileFilter,
} from '../../common/utils/file.upload.utils';
import { UserCreateRequestDto } from './dto/request/user-create.request.dto';
import { UserListQueryRequestDto } from './dto/request/user-list-query.request.dto';
import {
  UserLoginGoogleRequestDto,
  UserLoginRequestDto,
} from './dto/request/user-login.request.dto';
import { UserUpdateRequestDto } from './dto/request/user-update.request.dto';
import { UserDetailsResponseDto } from './dto/response/user-details.response.dto';
import { UserListResponseDto } from './dto/response/user-list.response.dto';
import { UserResponseMapper } from './user.response.mapper';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(AuthGuard())
  @Get()
  async getAllUsers(
    @Query() query: UserListQueryRequestDto,
  ): Promise<UserListResponseDto> {
    const result = await this.userService.getAllUsers(query);
    return UserResponseMapper.toListDto(result, query);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @ApiOperation({ summary: 'Create new user' })
  @Post()
  async createUser(
    @Body() body: UserCreateRequestDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserDetailsResponseDto> {
    if (file) {
      body.avatar = `public/${file.filename}`;
    }
    const user = await this.userService.createUser(body);
    return UserResponseMapper.toDetailsDto(user);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Get(':userId')
  async getUserById(
    @Param('userId') userId: string,
  ): Promise<UserDetailsResponseDto> {
    const user = await this.userService.getUserById(userId);
    return UserResponseMapper.toDetailsDto(user);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiBearerAuth()
  @RoleDecorator(
    RoleEnum.BUYER,
    RoleEnum.ADMIN,
    RoleEnum.MANAGER,
    RoleEnum.SELLER,
  )
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch(':userId')
  async updateUserById(
    @Body() body: UserUpdateRequestDto,
    @Param('userId') userId: string,
  ): Promise<UserDetailsResponseDto> {
    const user = await this.userService.updateUserById(userId, body);
    return UserResponseMapper.toDetailsDto(user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiBearerAuth()
  @RoleDecorator(
    RoleEnum.BUYER,
    RoleEnum.ADMIN,
    RoleEnum.MANAGER,
    RoleEnum.SELLER,
  )
  @UseGuards(AuthGuard(), RoleGuard)
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    await this.userService.deleteUser(userId);
  }

  @ApiOperation({ summary: 'User login' })
  @Post('login')
  async loginUser(
    @Body() body: UserLoginRequestDto,
  ): Promise<{ token: string }> {
    return await this.userService.login(body);
  }

  @ApiOperation({ summary: 'User logout' })
  @UseGuards(AuthGuard(), LogoutGuard)
  @Post('logout')
  async logoutUser() {
    return 'Exit';
  }

  @ApiOperation({ summary: 'User login by google' })
  @Post('social')
  async loginUserByGoogle(
    @Body() body: UserLoginGoogleRequestDto,
  ): Promise<{ token: string }> {
    return await this.userService.loginSocial(body);
  }

  @ApiOperation({ summary: 'Buy a premium account' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch('buy/premium')
  async buyPremiumType(@Req() req: Request): Promise<UserDetailsResponseDto> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log(token);
    return await this.userService.buyPremiumType(token);
  }
}
