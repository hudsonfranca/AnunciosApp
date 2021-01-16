import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { Address } from '../address/address.entity';
import { UserRole } from './user-role';
import * as argon2 from 'argon2';
import { deleteUserAtributes, userSelectAtributes } from '../utils';

interface createUserParams {
  createUserDto: CreateUserDto;
  role: UserRole;
}

interface updateUserParams {
  updateUserDto: UpdateUserDto;
  id: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  async createUser(params: createUserParams): Promise<User> {
    const { createUserDto, role } = params;

    if (!createUserDto) {
      throw new BadRequestException(' createUserDto is required.');
    }

    if (!role) {
      throw new BadRequestException(' role is required.');
    }

    const { name, email, password, phoneNumber, address } = createUserDto;

    const addressEntity = this.addressRepository.create({
      ...address,
    });

    const hashPassword = await argon2.hash(password);

    const userEntity = this.userRepository.create({
      name,
      email,
      phoneNumber,
      role,
      status: true,
      confirmationToken: '2212121212',
      password: hashPassword,
      address: addressEntity,
    });

    try {
      const savedUser = await this.userRepository.save(userEntity);
      return deleteUserAtributes(savedUser);
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException(`${userEntity.email} is already in use`);
      } else {
        throw new InternalServerErrorException('Could not save user.');
      }
    }
  }

  async finOneById(id: string) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }

    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('No user area found');
    }

    return user;
  }

  async updateUser(params: updateUserParams) {
    const {
      id,
      updateUserDto: {
        address: { zip, uf, street, number, city },
        name,
        phoneNumber,
        status,
        email,
      },
    } = params;

    const user = await this.finOneById(id);

    user.name = name ? name : user.name;
    user.status = status ? status : user.status;
    user.email = email ? email : user.email;
    user.phoneNumber = phoneNumber ? phoneNumber : user.phoneNumber;
    user.address.city = city ? city : user.address.city;
    user.address.number = number ? number : user.address.number;
    user.address.street = street ? street : user.address.street;
    user.address.zip = zip ? zip : user.address.zip;
    user.address.uf = uf ? uf : user.address.uf;

    const updatedUser = await this.userRepository.update({ id: user.id }, user);

    if (updatedUser.affected > 0) {
      const userEntity = await this.userRepository.findOne(user.id);

      return deleteUserAtributes(userEntity);
    } else {
      throw new NotFoundException(`no users found`);
    }
  }

  async finOneByEmail(email: string) {
    if (!email) {
      throw new BadRequestException('email is required.');
    }

    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException('No user area found');
    }

    return user;
  }

  async findAllUsers(params: { limit: number; offset: number }) {
    const { limit, offset } = params;

    const userQuery = await this.userRepository.createQueryBuilder('user');

    const count = await userQuery.getCount();

    const users = await userQuery
      .select(userSelectAtributes)
      .leftJoin('user.address', 'address')
      .skip(offset)
      .take(limit)
      .getMany();

    if (!users) {
      throw new NotFoundException('No user area found');
    }

    return { count, users };
  }

  async deleteUser(id: string) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }
    const user = await this.finOneById(id);

    try {
      await this.userRepository.delete(user.id);
      return { message: `user successfully removed` };
    } catch (error) {
      throw new InternalServerErrorException('could not delete the user.');
    }
  }
}
