import { Module } from '@nestjs/common';
import { PublicAreaModule } from './public-area/public-area.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AddressModule } from './address/address.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PublicAreaModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    AddressModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
