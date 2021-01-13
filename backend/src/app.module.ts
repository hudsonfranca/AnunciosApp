import { Module } from '@nestjs/common';
import { PublicAreaModule } from './public-area/public-area.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AddressModule } from './address/address.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PublicAreaModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    AddressModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
