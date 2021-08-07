import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './config/typeorm.config';
import { AddressModule } from './address/address.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdvertsModule } from './adverts/adverts.module';
import { CategoryModule } from './category/category.module';
import { AdvertsPhotosModule } from './adverts-photos/adverts-photos.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: DatabaseConnectionService }),
    AddressModule,
    UserModule,
    AuthModule,
    AdvertsModule,
    CategoryModule,
    AdvertsPhotosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
