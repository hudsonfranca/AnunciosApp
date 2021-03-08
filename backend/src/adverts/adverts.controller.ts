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
import { FindAdvertsQueryDto } from './dto/find-adverts-query.dto';
import { FindAdvertsByUserQueryDto } from './dto/find-adverts-by-user-query.dto';

@Controller('adverts')
export class AdvertsController {
  constructor(private advertsService: AdvertsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles()
  async create(@Body() createAdvertsDto: CreateAdvertsDto, @Request() req) {
   
    const adverts = await this.advertsService.createAdverts({
      createAdvertsDto,
      userId: req.user.id,
    });
    return adverts;
  }

  @Get('show/:id')
  async show(@Param() { id }: FindOneParams) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }
    const adverts = await this.advertsService.findOneById(id);

    return adverts;
  }

  @Get('user/my-adverts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, )
  async advertsByUser(
    @Query() query: FindAdvertsByUserQueryDto,
    @Request() req,
  ) {
    const adverts = await this.advertsService.findOneByUser(query, req.user.id);

    return adverts;
  }

  @Get()
  async index(@Query() query: FindAdvertsQueryDto) {
    const adverts = await this.advertsService.findAdverts(query);
    return adverts;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles( )
  async update(
    @Request() req,
    @Param() { id }: FindOneParams,
    @Body() updateAdvertsDto: UpdateAdvertsDto,
  ) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }

    const adverts = await this.advertsService.findOneById(id);

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER )
  async delete(@Param() { id }: FindOneParams, @Request() req) {
    const adverts = await this.advertsService.findOneById(id);

    if (adverts.user.id !== req.user.id) {
      throw new UnauthorizedException();
    }
    const result = await this.advertsService.deleteAdverts(id);
    return result;
  }
}
