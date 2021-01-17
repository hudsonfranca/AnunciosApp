import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertsPhotos } from './adverts-photos.entity';
import { AdvertsPhotosService } from './adverts-photos.service';
import { AdvertsPhotosController } from './adverts-photos.controller';
import { AdvertsModule } from '../adverts/adverts.module';

@Module({
  providers: [AdvertsPhotosService],
  controllers: [AdvertsPhotosController],
  imports: [TypeOrmModule.forFeature([AdvertsPhotos]), AdvertsModule],
})
export class AdvertsPhotosModule {}
