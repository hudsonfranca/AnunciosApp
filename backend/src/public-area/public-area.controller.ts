import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreatePublicAreaDto } from './dto/create-public-area.dto';
import { PublicAreaService } from './public-area.service';
import { FindOneParams } from './dto/find-one.dto';
import { UpdatePublicAreaDto } from './dto/update-public-area.dto';

@Controller('public-area')
export class PublicAreaController {
  constructor(private publicAreaService: PublicAreaService) {}
  @Post()
  async create(@Body() createPublicAreaDto: CreatePublicAreaDto) {
    const publicArea = await this.publicAreaService.CreatePublicArea(
      createPublicAreaDto,
    );

    return publicArea;
  }

  @Get()
  async findMany() {
    const publicAreas = await this.publicAreaService.findMany();
    return publicAreas;
  }

  @Get(':id')
  async findOne(@Param() { id }: FindOneParams) {
    const publicArea = await this.publicAreaService.findOne(id);
    return publicArea;
  }

  @Patch(':id')
  async update(
    @Param() { id }: FindOneParams,
    @Body() updatePublicAreaDto: UpdatePublicAreaDto,
  ) {
    const publicArea = await this.publicAreaService.update(
      updatePublicAreaDto,
      id,
    );
    return publicArea;
  }

  @Delete(':id')
  async delete(@Param() { id }: FindOneParams) {
    return await this.publicAreaService.delete(id);
  }
}
