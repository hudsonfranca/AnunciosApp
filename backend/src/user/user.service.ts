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
    @InjectRepository(Address) private addressRepository: Repository<Address>
  ) {}

  async createUser(params: createUserParams): Promise<User> {
    const { createUserDto, roles } = params;

    if (!createUserDto) {
      throw new BadRequestException('createUserDto is required.');
    }

    if (!roles) {
      throw new BadRequestException(' role is required.');
    }

    const { first_name,last_name, email, password, phone_number, address } = createUserDto;

    const addressEntity = this.addressRepository.create({
      ...address,
    });

    const hashPassword = await argon2.hash(password);

    const userEntity = this.userRepository.create({
      first_name,
      last_name,
      email,
      phone_number,
      roles,
      status: true,
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

    return user;
  }

  async updateUser(params: updateUserParams) {
    const {
      id,
      updateUserDto: {
        address: { zip, state, neighborhood,street, number, city },
        first_name,
        last_name,
        phone_number,
        status,
        email,
      },
    } = params;

    const user = await this.findOne({ id });

    user.first_name = first_name ? first_name : user.first_name;
    user.last_name = last_name ? last_name : user.last_name;
    user.status = status ? status : user.status;
    user.email = email ? email : user.email;
    user.phone_number = phone_number ? phone_number : user.phone_number;
    user.address.city = city ? city : user.address.city;
    user.address.number = number ? number : user.address.number;
    user.address.street = street ? street : user.address.street;
    user.address.zip = zip ? zip : user.address.zip;
    user.address.state = state ? state : user.address.state;
    user.address.neighborhood = neighborhood ? neighborhood : user.address.neighborhood;

  

    try {
      const updatedUser = await this.userRepository.save(user);
      return deleteUserAtributes(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException('Unable to update your data');
      
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

  async saveUser(user: User) {
    try {
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      console.log(error)
      if (error.code.toString() === '23505') {
        throw new ConflictException(`email is already in use`);
      } else {
        throw new InternalServerErrorException('Could not save user.');
      }
    }
  }


}
