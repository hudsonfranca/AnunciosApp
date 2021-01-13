import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from '../address/address.entity';
import { UserRole } from './user-role';

class FakeRepository {
  public create(): void {}
  public async save(): Promise<void> {}
  public async delete(): Promise<void> {}
  public async findOne(): Promise<void> {}
  public async update(): Promise<void> {}
  public async find(): Promise<void> {}
}

describe('User Service', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  // let addressRepository: Repository<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: FakeRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    // addressRepository = module.get(getRepositoryToken(Address));
  });

  describe('Create User', () => {
    // const createAddressDto: CreateAddressDto = {
    //   city: 'Rio',
    //   number: 12,
    //   street: 'Rua do Joao',
    //   uf: 'RJ',
    //   zip: '12345678',
    // };
    // const createuserDto: CreateUserDto = {
    //   name: 'joao',
    //   email: 'j@g.com',
    //   password: '12345678',
    //   passwordConfirmation: '12345678',
    //   address: createAddressDto,
    // };
    it('must save user', async () => {
      const userRepositoryCreateSpy = jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue();

      // const addressRepositoryCreateSpy = jest
      //   .spyOn(userRepository, 'create')
      //   .mockResolvedValue('address created');

      // const userRepositorySaveSpy = jest
      //   .spyOn(userRepository, 'save')
      //   .mockResolvedValue('user saved');

      // const createAddressDto: CreateAddressDto = {
      //   city: 'Rio',
      //   number: 12,
      //   street: 'Rua A',
      //   uf: 'RJ',
      //   zip: '12345678',
      // };

      // const createuserDto: CreateUserDto = {
      //   email: 'h@g.com',
      //   name: 'joao',
      //   password: '12345678',
      //   passwordConfirmation: '12345678',
      //   address: createAddressDto,
      // };

      // const result = await userService.createUser({
      //   createUserDto: createuserDto,
      //   role: UserRole.ADMIN,
      // });

      // expect(userRepositoryCreateSpy).toBeCalledTimes(1);
      // expect(addressRepositoryCreateSpy).toBeCalledTimes(1);
      // expect(userRepositorySaveSpy).toBeCalledTimes(1);
      // expect(result).toBe('user saved');
    });
  });
});
