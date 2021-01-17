import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdvertsPhotos } from './adverts-photos.entity';
import { Repository } from 'typeorm';
import { File } from './adverts-photos.controller';
import { AdvertsService } from '../adverts/adverts.service';

@Injectable()
export class AdvertsPhotosService {
  constructor(
    @InjectRepository(AdvertsPhotos)
    private advertsPhotosRepository: Repository<AdvertsPhotos>,
    private advertsService: AdvertsService,
  ) {}

  async createAdvertsPhoto(params: { file: File; advertsId: string }) {
    const { advertsId, file } = params;
    delete file.size;
    delete file.fieldname;

    const adverts = await this.advertsService.finOneById(advertsId);

    const advertsPhoto = this.advertsPhotosRepository.create(file);

    advertsPhoto.adverts = adverts;

    try {
      const savedAdvertsPhoto = await this.advertsPhotosRepository.save(
        advertsPhoto,
      );
      return savedAdvertsPhoto;
    } catch (error) {
      throw new InternalServerErrorException('The photo was not saved.');
    }
  }
}
