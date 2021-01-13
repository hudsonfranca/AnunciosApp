import { Module } from '@nestjs/common';
import { PublicAreaService } from './public-area.service';
import { PublicAreaController } from './public-area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicArea } from './public-area.entity';

@Module({
  providers: [PublicAreaService],
  controllers: [PublicAreaController],
  imports: [TypeOrmModule.forFeature([PublicArea])],
})
export class PublicAreaModule {}
