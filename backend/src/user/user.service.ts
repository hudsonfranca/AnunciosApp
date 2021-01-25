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
import { deleteUserAtributes, userSelectAtributes } from '../utils/utils';
import * as crypto from 'crypto';
import { SendEmail } from '../utils/SendEmail';
import { FindUserQueryDto } from './dto/find-user-query.dto';

interface createUserParams {
  createUserDto: CreateUserDto;
  roles: UserRole[];
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
    private sendEmail: SendEmail,
  ) {}

  async createUser(params: createUserParams): Promise<User> {
    const { createUserDto, roles } = params;

    if (!createUserDto) {
      throw new BadRequestException('createUserDto is required.');
    }

    if (!roles) {
      throw new BadRequestException(' role is required.');
    }

    const { name, email, password, phoneNumber, address } = createUserDto;

    const addressEntity = this.addressRepository.create({
      ...address,
    });

    const hashPassword = await argon2.hash(password);
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    const userEntity = this.userRepository.create({
      name,
      email,
      phoneNumber,
      roles,
      status: true,
      confirmationToken,
      password: hashPassword,
      address: addressEntity,
    });

    const savedUser = await this.saveUser(userEntity);
    return deleteUserAtributes(savedUser);
  }

  async findOne(param: Partial<User>) {
    if (!param) {
      throw new BadRequestException('param is required.');
    }

    const user = await this.userRepository.findOne({ where: param });
    if (!user) {
      throw new NotFoundException('No user area found');
    }

    return deleteUserAtributes(user);
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

    const user = await this.findOne({ id });

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
      const userEntity = await this.findOne({ id });

      return deleteUserAtributes(userEntity);
    } else {
      throw new NotFoundException(`no users found`);
    }
  }

  async findAllUsers(queryDto: FindUserQueryDto) {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const userQuery = this.userRepository.createQueryBuilder('user');

    const [users, count] = await userQuery
      .select(userSelectAtributes)
      .leftJoin('user.address', 'address')
      .skip((queryDto.page - 1) * queryDto.limit)
      .take(queryDto.limit)
      .orderBy(queryDto.sort ? JSON.stringify(queryDto.sort) : undefined)
      .getManyAndCount();

    if (!users) {
      throw new NotFoundException('No user area found');
    }

    return { count: count, users: users };
  }

  async deleteUser(id: string) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }
    const user = await this.findOne({ id });

    try {
      await this.userRepository.delete(user.id);
      return { message: `user successfully removed` };
    } catch (error) {
      throw new InternalServerErrorException('could not delete the user.');
    }
  }

  async confirmEmail(confirmationToken: string): Promise<void> {
    const user = await this.findOne({ confirmationToken });
    user.roles = [...user.roles, UserRole.VERIFIED_EMAIL];

    await this.saveUser(user);
    return;
  }

  async saveUser(user: User) {
    try {
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException(`email is already in use`);
      } else {
        throw new InternalServerErrorException('Could not save user.');
      }
    }
  }

  async changePassword(params: { id: string; password: string }) {
    const { id, password } = params;
    const user = await this.findOne({ id });

    const hashPassword = await argon2.hash(password);

    user.password = hashPassword;
    user.recoverToken = null;

    await this.saveUser(user);
  }
}
