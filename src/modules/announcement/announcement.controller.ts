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
import { AnnouncementResponseMapper } from './announcement.response.mapper';
import { AnnouncementService } from './announcement.service';
import { AnnouncementCreateRequestDto } from './dto/request/announcement-create.request.dto';
import { AnnouncementUpdateRequestDto } from './dto/request/announcement-update.request.dto';
import { AnnouncementDetailsResponseDto } from './dto/response/announcement-details.response.dto';
import { UserListQueryRequestDto } from "../user/dto/request/user-list-query.request.dto";

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
  // @RoleDecorator(
  //   RoleEnum.BUYER,
  //   RoleEnum.ADMIN,
  //   RoleEnum.MANAGER,
  //   RoleEnum.SELLER,
  // )
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

  @ApiOperation({ summary: 'Get announcement by id' })
  @Get(':announcementId')
  async getAnnouncementById(
    @Param('announcementId') announcementId: string,
  ): Promise<AnnouncementDetailsResponseDto> {
    const announcement =
      await this.announcementService.getAnnouncementById(announcementId);
    return AnnouncementResponseMapper.toDetailsDto(announcement);
  }

  @ApiOperation({ summary: 'Update announcement by id' })
  @Patch(':announcementId')
  async updateCarById(
    @Body() body: AnnouncementUpdateRequestDto,
    @Param('announcementId') announcementId: string,
  ): Promise<AnnouncementDetailsResponseDto> {
    const car = await this.announcementService.updateCarById(
      announcementId,
      body,
    );
    return AnnouncementResponseMapper.toDetailsDto(car);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete announcement by id' })
  @Delete(':announcementId')
  async deleteCar(
    @Param('announcementId') announcementId: string,
  ): Promise<void> {
    await this.announcementService.deleteCar(announcementId);
  }
}
