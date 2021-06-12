import { Address } from '../address/address.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from './user-role';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserQueryDto } from './dto/find-user-query.dto';

const mockAddressRepository = () => ({
  create: jest.fn().mockReturnValue(addressEntity),
});

const addressEntity = Address.of({
  zip: '11905000',
  city: 'Sao Paulo',
  number: 28,
  street: 'Rua A',
  state: 'SP',
  neighborhood:"Bairro A"
});
const savedAddress = Address.of({
  id: 'c52772d8-2051-414d-9b3e-11f72792c88b',
  zip: '11905000',
  city: 'Sao Paulo',
  number: 28,
  street: 'Rua A',
  state: 'SP',
  neighborhood:"Bairro A",
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createdUser = User.of({
  first_name: 'Admin',
  last_name:'Adm',
  email: 'admin@gmail.com',
  password: '12345678',
  phone_number: '123456789',
  status: false,
});

const savedUser = User.of({
  id: '2e35f06a-f398-4aa9-b6c0-3c26a61cf3de',
  first_name: 'Admin',
  last_name:'Adm',
  email: 'admin@gmail.com',
  password: '12345678',
  phone_number: '123456789',
  roles: [UserRole.ADMIN],
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
  first_name: 'Admin',
  last_name:'Adm',
  email: 'blade.hudson.email@gmail.com',
  password: '12345678',
  phone_number: '123456789',
 
  address: {
    zip: '29905540',
    city: 'Linhares',
    number: 28,
    street: 'Rua São Jose',
    state: 'ES',
    neighborhood:"Bairro A"
  },
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let addressRepository: Repository<Address>;

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
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    addressRepository = module.get(getRepositoryToken(Address));
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

 

  describe('findAllUsers', () => {
    it('', async () => {
      const queryDto: FindUserQueryDto = {
        limit: 10,
        page: 1,
      };

      const result = await userService.findAllUsers(queryDto);

      expect(result).toEqual({ count: 1, users: savedUser });
    });
  });

  describe('deleteUser', () => {
    it('should throw an error if the id was not provided', async () => {
      try {
        await userService.deleteUser('');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('id is required.');
      }
    });

    it('must delete a user', async () => {
      const userServiceFindOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(savedUser);

      const userRepositoryDeleteSpy = jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 1 });

      const id = '2e35f06a-f398-4aa9-b6c0-3c26a61cf3de';

      expect(await userService.deleteUser(id)).toEqual({
        message: `user successfully removed`,
      });

      expect(userRepositoryDeleteSpy).toHaveBeenCalledWith(id);
      expect(userServiceFindOneSpy).toHaveBeenCalledWith({ id });
    });
  });


  describe('saveUser', () => {
    it('must save a user', async () => {
      const userRepositorySaveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(savedUser);

      const result = await userService.saveUser(createdUser);

      expect(result).toBe(savedUser);
      expect(userRepositorySaveSpy).toHaveBeenLastCalledWith(createdUser);
    });
  });


});
