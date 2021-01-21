import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvertsController } from './adverts.controller';
import { AdvertsService } from './adverts.service';
import { Adverts } from './adverts.entity';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';
import { Address } from '../address/address.entity';

@Module({
  controllers: [AdvertsController],
  providers: [AdvertsService],
  imports: [
    TypeOrmModule.forFeature([Adverts, Address]),
    CategoryModule,
    UserModule,
  ],
  exports: [AdvertsService],
})
export class AdvertsModule {}
