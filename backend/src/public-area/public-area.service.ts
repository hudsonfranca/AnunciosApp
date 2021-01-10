import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublicAreaDto } from './dto/create-public-area.dto';
import { UpdatePublicAreaDto } from './dto/update-public-area.dto';
import { PublicArea } from './public-area.entity';

@Injectable()
export class PublicAreaService {
  constructor(
    @InjectRepository(PublicArea)
    private publicAreaRepository: Repository<PublicArea>,
  ) {}

  async CreatePublicArea(
    createPublicAreaDto: CreatePublicAreaDto,
  ): Promise<PublicArea> {
    const { name } = createPublicAreaDto;

    if (!name) {
      throw new BadRequestException('Name is required.');
    }
    const publicArea = this.publicAreaRepository.create({ name });
    try {
      const createdPublicArea = await this.publicAreaRepository.save(
        publicArea,
      );
      return createdPublicArea;
    } catch (error) {
      throw new InternalServerErrorException('Could not save public area.');
    }
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }

    const publicArea = await this.publicAreaRepository.findOne(id);

    if (!publicArea) {
      throw new NotFoundException('No public area found');
    }

    return publicArea;
  }

  async findMany(): Promise<PublicArea[]> {
    const publicAreas = await this.publicAreaRepository.find();
    if (!publicAreas) {
      throw new NotFoundException('No public area found');
    }
    return publicAreas;
  }

  async update(updatePublicAreaDto: UpdatePublicAreaDto, id: string) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }
    if (!updatePublicAreaDto) {
      throw new BadRequestException('UpdatePublicAreaDto is required.');
    }
    const result = await this.publicAreaRepository.update(
      { id },
      updatePublicAreaDto,
    );
    if (result.affected > 0) {
      const publicArea = this.publicAreaRepository.findOne(id);
      return publicArea;
    } else {
      throw new NotFoundException(`public area does not exist`);
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('id is required.');
    }
    const publicArea = await this.publicAreaRepository.findOne(id);
    if (!publicArea) {
      throw new NotFoundException(`public area does not exist`);
    }

    try {
      await this.publicAreaRepository.delete(id);
      return { message: `public area successfully removed` };
    } catch (error) {
      throw new InternalServerErrorException(
        'could not delete the public area.',
      );
    }
  }
}
