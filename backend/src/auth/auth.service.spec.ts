import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { SendEmail } from '../utils/SendEmail';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UnprocessableEntityException } from '@nestjs/common';

const userEntity = async () => {
  return User.of({
    id: '2e35f06a-f398-4aa9-b6c0-3c26a61cf3de',
    name: 'Admin hg',
    email: 'admin@gmail.com',
    password: await argon2.hash('12345678'),
    phoneNumber: '123456789',
    confirmationToken: crypto.randomBytes(32).toString('hex'),
    status: false,
    createdAt: new Date('2021-01-23T21:15:16.629Z'),
    updatedAt: new Date('2021-01-23T21:15:16.629Z'),
  });
};

class fakeJwtService {
  sign(): void {}
  verify(): void {}
}

class fakeSendEmail {
  async send(): Promise<void> {}
}

class fakeMailerService {
  async sendMail(): Promise<void> {}
}

const FakeUserService = async () => ({
  findOne: async () => {},
  createUser: jest.fn().mockResolvedValue(await userEntity()),
  confirmEmail: jest.fn(),
  saveUser: async () => {},
  changePassword: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let sendEmail: SendEmail;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useFactory: FakeUserService,
        },
        {
          provide: JwtService,
          useClass: fakeJwtService,
        },
        {
          provide: SendEmail,
          useClass: fakeSendEmail,
        },
        {
          provide: MailerService,
          useClass: fakeMailerService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    sendEmail = module.get<SendEmail>(SendEmail);
    mailerService = module.get<MailerService>(MailerService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('validateUser', () => {
    it('must return null if the passwords are not the same', async () => {
      const email = 'admin@gmail.com';
      const password = '12345679';
      const result = await authService.validateUser(email, password);
      expect(result).toBe(null);
    });
    it('must return the validated user', async () => {
      const email = 'admin@gmail.com';
      const password = '12345678';

      const user = await userEntity();

      const userServiceFindOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(user);

      const result = await authService.validateUser(email, password);
      expect(result).toBe(user);
      expect(userServiceFindOneSpy).toBeCalledWith({ email });
    });
  });

  describe('signin', () => {
    it('should call the sign method of JwtService', async () => {
      const jwtServiceSignSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue('token');

      const user = await userEntity();

      const result = await authService.signin(user);
      expect(result).toBe('token');
      expect(jwtServiceSignSpy).toBeCalledWith({
        email: user.email,
        sub: user.id,
      });
    });
  });
  describe('signup', () => {
    it('must create a user and send an email', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Hudson',
        email: 'hudsonsilvares@gmail.com',
        password: '12345678',
        passwordConfirmation: '12345678',
        phoneNumber: '123456789',
        status: false,
        address: {
          zip: '29905540',
          city: 'Sao Paulo',
          number: 28,
          street: 'Rua do são João',
          uf: 'SP',
        },
      };
      const sendEmailSendSpy = jest
        .spyOn(sendEmail, 'send')
        .mockResolvedValue('Sent');

      const authServiceSigninSpy = jest
        .spyOn(authService, 'signin')
        .mockResolvedValue('token');

      const result = await authService.signup(createUserDto);

      expect(result).toBe('token');
      expect(sendEmailSendSpy).toHaveBeenCalled();
      expect(authServiceSigninSpy).toHaveBeenCalled();
    });
  });

  describe('confirmEmail', () => {
    it('must call the confirmEmail method of userService', async () => {
      const confirmationToken = '66565656556565';

      await authService.confirmEmail(confirmationToken);
      expect(userService.confirmEmail).toHaveBeenCalled();
    });
  });

  describe('sendPasswordRecoveryEmail', () => {
    it('must send password recovery email', async () => {
      const user = await userEntity();

      const email = 'admin@gmail.com';

      const userServiceFindOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(user);

      const sendEmailSendSpy = jest
        .spyOn(sendEmail, 'send')
        .mockResolvedValue('Sent');

      const userServiceSaveUserSpy = jest
        .spyOn(userService, 'saveUser')
        .mockResolvedValue(user);

      await authService.sendPasswordRecoveryEmail(email);

      expect(sendEmailSendSpy).toHaveBeenCalled();
      expect(userServiceFindOneSpy).toHaveBeenCalledWith({ email });
      expect(userServiceSaveUserSpy).toHaveBeenLastCalledWith(user);
    });
  });

  describe('resetPassword', () => {
    it('must reset password', async () => {
      const recoverToken = '77474748387483847';
      const user = await userEntity();
      const password = '12345678';

      const userServiceFindOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(user);

      const changePasswordDto: ChangePasswordDto = {
        password,
        passwordConfirmation: password,
      };

      await authService.resetPassword({ recoverToken, changePasswordDto });

      expect(userServiceFindOneSpy).toHaveBeenCalledWith({ recoverToken });
      expect(userService.changePassword).toHaveBeenCalledWith({
        id: user.id,
        password,
      });
    });

    it('should throw an error if the password and the confirmation password are not the same', async () => {
      const changePasswordDto: ChangePasswordDto = {
        password: '23456789',
        passwordConfirmation: '12345678',
      };
      const recoverToken = '77474748387483847';

      try {
        await authService.resetPassword({ recoverToken, changePasswordDto });
      } catch (error) {
        expect(error).toBeInstanceOf(UnprocessableEntityException);
        expect(error.message).toBe('Password must match');
      }
    });
  });
});
