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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { RoleDecorator } from '../../common/decorator/role.decorator';
import { RoleEnum } from '../../common/enum/role.enum';
import { RoleGuard } from '../../common/guard/role.guard';
import { UserListQueryRequestDto } from '../user/dto/request/user-list-query.request.dto';
import { AnnouncementResponseMapper } from './announcement.response.mapper';
import { AnnouncementService } from './announcement.service';
import { AnnouncementCreateRequestDto } from './dto/request/announcement-create.request.dto';
import { AnnouncementUpdateRequestDto } from './dto/request/announcement-update.request.dto';
import { AnnouncementDetailsResponseDto } from './dto/response/announcement-details.response.dto';

@ApiTags('Announcement')
@Controller('announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @ApiOperation({ summary: 'Get all announcement' })
  @Get()
  async getAllAnnouncement(
    @Query() query: UserListQueryRequestDto,
  ): Promise<AnnouncementDetailsResponseDto> {
    const result = await this.announcementService.getAllAnnouncement(query);
    return AnnouncementResponseMapper.toListDto(result, query);
  }

  @ApiOperation({ summary: 'Create new announcement' })
  @ApiBearerAuth()
  @RoleDecorator(
    RoleEnum.BUYER,
    RoleEnum.ADMIN,
    RoleEnum.MANAGER,
    RoleEnum.SELLER,
  )
  @UseGuards(AuthGuard(), RoleGuard)
  @Post()
  async createAnnouncement(
    @Body() body: AnnouncementCreateRequestDto,
    @Req() req: Request,
  ): Promise<AnnouncementDetailsResponseDto> {
    const token = req.headers.authorization?.replace('Bearer ', '');

    const announcement = await this.announcementService.createAnnouncement(
      body,
      token,
    );
    return AnnouncementResponseMapper.toDetailsDto(announcement);
  }

  @ApiOperation({ summary: 'information about announcement by id' })
  @ApiBearerAuth()
  @RoleDecorator(
    RoleEnum.BUYER,
    RoleEnum.ADMIN,
    RoleEnum.MANAGER,
    RoleEnum.SELLER,
  )
  @UseGuards(AuthGuard(), RoleGuard)
  @Get('/infoAnnouncement/:announcementId')
  async infoAnnouncement(@Req() req: Request): Promise<any> {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return await this.announcementService.infoAnnouncement(token);
  }

  @ApiOperation({ summary: 'Get announcement by id' })
  @ApiBearerAuth()
  @RoleDecorator(
    RoleEnum.BUYER,
    RoleEnum.ADMIN,
    RoleEnum.MANAGER,
    RoleEnum.SELLER,
  )
  @UseGuards(AuthGuard(), RoleGuard)
  @Get(':announcementId')
  async getAnnouncementById(
    @Param('announcementId') announcementId: string,
  ): Promise<AnnouncementDetailsResponseDto> {
    await this.announcementService.incrementViewsCount(announcementId);
    const { announcement, allCurrency } =
      await this.announcementService.getAnnouncementById(announcementId);
    return AnnouncementResponseMapper.toDetailsDto(announcement, allCurrency);
  }

  @ApiOperation({ summary: 'В розробці' })
  @ApiBearerAuth()
  @RoleDecorator(
    RoleEnum.BUYER,
    RoleEnum.ADMIN,
    RoleEnum.MANAGER,
    RoleEnum.SELLER,
  )
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch(':announcementId')
  async updateAnnouncementById(
    @Body() body: AnnouncementUpdateRequestDto,
    @Param('announcementId') announcementId: string,
  ): Promise<AnnouncementDetailsResponseDto> {
    const announcement = await this.announcementService.updateAnnouncementById(
      announcementId,
      body,
    );
    return AnnouncementResponseMapper.toDetailsDto(announcement);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'В розробці' })
  @ApiBearerAuth()
  @RoleDecorator(
    RoleEnum.BUYER,
    RoleEnum.ADMIN,
    RoleEnum.MANAGER,
    RoleEnum.SELLER,
  )
  @UseGuards(AuthGuard(), RoleGuard)
  @Delete(':announcementId')
  async deleteAnnouncement(
    @Param('announcementId') announcementId: string,
  ): Promise<void> {
    await this.announcementService.deleteAnnouncement(announcementId);
  }
}
