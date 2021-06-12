import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Address } from '../address/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User, Address])],
  exports: [UserService],
})
export class UserModule {}
