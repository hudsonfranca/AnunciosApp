import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { User } from 'src/user/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserRole } from '../user/user-role';
import { MailerService } from '@nestjs-modules/mailer';
import { keys } from '../keys';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({ email });

    try {
      if (user && (await argon2.verify(user.password, password))) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      throw new InternalServerErrorException('Could not authenticate user');
    }
  }

  async signin(user: User) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser({
      createUserDto,
      roles: [UserRole.USER],
    });

    const email = {
      to: user.email,
      from: keys.emailAddress,
      subject: 'Email de confirmação',
      template: 'email-confirmation',
      context: {
        token: user.confirmationToken,
      },
    };

    try {
      await this.mailerService.sendMail(email);
    } catch (error) {
      throw new InternalServerErrorException(
        'confirmation email cannot be sent',
      );
    }

    const token = await this.signin(user);
    return token;
  }

  async confirmEmail(confirmationToken: string) {
    return await this.userService.confirmEmail(confirmationToken);
  }
}
