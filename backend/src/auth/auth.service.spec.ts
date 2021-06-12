import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

const userEntity = async () => {
  return User.of({
    id: '2e35f06a-f398-4aa9-b6c0-3c26a61cf3de',
    first_name: 'Admin',
    last_name:'Adm',
    email: 'admin@gmail.com',
    password: await argon2.hash('12345678'),
    phone_number: '123456789',
    status: false,
    createdAt: new Date('2021-01-23T21:15:16.629Z'),
    updatedAt: new Date('2021-01-23T21:15:16.629Z'),
  });
};

class fakeJwtService {
  sign(): void {}
  verify(): void {}
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
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
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
 
});
