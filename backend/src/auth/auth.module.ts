import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { keys } from '../keys';
import { JwtStrategy } from './jwt.strategy';
import { SendEmail } from '../utils/SendEmail';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy, SendEmail],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: keys.jwtKey,
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
