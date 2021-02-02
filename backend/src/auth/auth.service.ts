import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { User } from 'src/user/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserRole } from '../user/user-role';
import { SendEmail } from '../utils/SendEmail';
import { randomBytes } from 'crypto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private sendEmail: SendEmail,
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
      subject: 'Email de confirmação',
      template: 'email-confirmation',
      context: {
        token: user.confirmationToken,
      },
    };

    await this.sendEmail.send({ ...email, user });

    const token = await this.signin(user);
    return token;
  }

  async confirmEmail(confirmationToken: string) {
    return await this.userService.confirmEmail(confirmationToken);
  }

  async sendPasswordRecoveryEmail(email: string) {
    const user = await this.userService.findOne({ email });

    user.recoverToken = randomBytes(32).toString('hex');

    const savedUser = await this.userService.saveUser(user);

    await this.sendEmail.send({
      subject: 'Recuperação de senha',
      template: 'recover-password',
      context: {
        token: savedUser.recoverToken,
      },
      user: savedUser,
    });
  }

  async resetPassword(params: {
    recoverToken: string;
    changePasswordDto: ChangePasswordDto;
  }) {
    const {
      recoverToken,
      changePasswordDto: { password, passwordConfirmation },
    } = params;

    if (password !== passwordConfirmation) {
      throw new UnprocessableEntityException('Password must match');
    }

    const user = await this.userService.findOne({ recoverToken });

    await this.userService.changePassword({ id: user.id, password });
  }

 
}
