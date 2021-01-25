import { Address } from '../address/address.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from './user-role';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { SendEmail } from '../utils/SendEmail';
import { MailerService } from '@nestjs-modules/mailer';

const mockAddressRepository = () => ({
  create: jest.fn().mockReturnValue(addressEntity),
});

const addressEntity = Address.of({
  zip: '11905000',
  city: 'Sao Paulo',
  number: 28,
  street: 'Rua A',
  uf: 'SP',
});
const savedAddress = Address.of({
  id: 'c52772d8-2051-414d-9b3e-11f72792c88b',
  zip: '11905000',
  city: 'Sao Paulo',
  number: 28,
  street: 'Rua A',
  uf: 'SP',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createdUser = User.of({
  name: 'Admin hg',
  email: 'admin@gmail.com',
  password: '12345678',
  phoneNumber: '123456789',
  status: false,
  confirmationToken: crypto.randomBytes(32).toString('hex'),
});

const savedUser = User.of({
  id: '2e35f06a-f398-4aa9-b6c0-3c26a61cf3de',
  name: 'Admin hg',
  email: 'admin@gmail.com',
  password: '12345678',
  phoneNumber: '123456789',
  status: false,
  address: savedAddress,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockUserRepository = () => ({
  save: async () => {},
  create: jest.fn().mockReturnValue(createdUser),
  dispose: async () => {},
  delete: async () => {},
  findOne: async () => {},
  update: async () => {},
  find: jest.fn().mockResolvedValue([savedUser]),
  createQueryBuilder: jest.fn(() => ({
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(savedUser),
    getManyAndCount: jest.fn().mockResolvedValue([savedUser, 1]),
  })),
});

const createUserDto: CreateUserDto = {
  name: 'Admin hg',
  email: 'blade.hudson.email@gmail.com',
  password: '12345678',
  passwordConfirmation: '12345678',
  phoneNumber: '123456789',
  status: false,
  address: {
    zip: '29905540',
    city: 'Linhares',
    number: 28,
    street: 'Rua São Jose',
    uf: 'ES',
  },
};

class fakeSendEmail {
  async send(): Promise<void> {}
}

class fakeMailerService {
  async sendMail(): Promise<void> {}
}

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let addressRepository: Repository<Address>;
  let sendEmail: SendEmail;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Address),
          useFactory: mockAddressRepository,
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
    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    addressRepository = module.get(getRepositoryToken(Address));
    sendEmail = module.get<SendEmail>(SendEmail);
    mailerService = module.get<MailerService>(MailerService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('must create an administrator user', async () => {
      const userServiceSaveUserSpy = jest
        .spyOn(userService, 'saveUser')
        .mockResolvedValue(savedUser);

      const result = await userService.createUser({
        createUserDto,
        roles: [UserRole.ADMIN],
      });

      expect(result).toEqual(savedUser);
      expect(userServiceSaveUserSpy).toHaveBeenCalledWith(createdUser);
      expect(addressRepository.create).toHaveBeenCalledWith(
        createUserDto.address,
      );
    });
  });
});
