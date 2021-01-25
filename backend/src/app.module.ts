import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AddressModule } from './address/address.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdvertsModule } from './adverts/adverts.module';
import { CategoryModule } from './category/category.module';
import { AdvertsPhotosModule } from './adverts-photos/adverts-photos.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './config/meiler.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AddressModule,
    UserModule,
    AuthModule,
    AdvertsModule,
    CategoryModule,
    AdvertsPhotosModule,
    MailerModule.forRoot(mailerConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
