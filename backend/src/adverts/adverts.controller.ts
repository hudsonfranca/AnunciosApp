import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AdvertsService } from './adverts.service';
import { CreateAdvertsDto } from './dto/create-adverts.dto';
import { UpdateAdvertsDto } from './dto/update-adverts.dto';
import { FindOneParams } from './dto/find-one.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/user-role';

@Controller('adverts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdvertsController {
  constructor(private advertsService: AdvertsService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.VERIFIED_EMAIL)
  async create(@Body() createAdvertsDto: CreateAdvertsDto, @Request() req) {
    const adverts = await this.advertsService.createAdverts({
      createAdvertsDto,
      userId: req.user.id,
    });
    return adverts;
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.VERIFIED_EMAIL)
  async show(@Param() { id }: FindOneParams, @Request() req) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }
    const adverts = await this.advertsService.finOneById(id);

    if (adverts.user.id !== req.user.id) {
      throw new UnauthorizedException();
    }

    return adverts;
  }

  @Get()
  @Roles(UserRole.USER, UserRole.VERIFIED_EMAIL)
  async index(@Query('offset') offset: number, @Query('limit') limit: number) {
    const adverts = await this.advertsService.findManyAdverts({
      limit,
      offset,
    });
    return adverts;
  }

  @Patch(':id')
  @Roles(UserRole.USER, UserRole.VERIFIED_EMAIL)
  async update(
    @Request() req,
    @Param() { id }: FindOneParams,
    @Body() updateAdvertsDto: UpdateAdvertsDto,
  ) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }

    const adverts = await this.advertsService.finOneById(id);

    if (adverts.user.id !== req.user.id) {
      throw new UnauthorizedException();
    }

    if (!UpdateAdvertsDto) {
      throw new BadRequestException('UpdateAdvertsDto is required.');
    }
    const updateAdverts = await this.advertsService.updateAdverts({
      updateAdvertsDto,
      id,
    });

    return updateAdverts;
  }

  @Delete(':id')
  @Roles(UserRole.USER, UserRole.VERIFIED_EMAIL)
  async delete(@Param() { id }: FindOneParams, @Request() req) {
    const adverts = await this.advertsService.finOneById(id);

    if (adverts.user.id !== req.user.id) {
      throw new UnauthorizedException();
    }
    const result = await this.advertsService.deleteAdverts(id);
    return result;
  }
}
