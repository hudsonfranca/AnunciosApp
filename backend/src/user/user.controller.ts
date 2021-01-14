import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './user-role';
import { UserService } from './user.service';
import { FindOneParams } from './dto/find-one.dto';
import { FindOneByEmail } from './dto/find-one-by-email.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { deleteUserAtributes } from '../utils';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser({
      createUserDto,
      role: UserRole.ADMIN,
    });

    return user;
  }

  @Patch(':id')
  async update(
    @Param() { id }: FindOneParams,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }
    if (!updateUserDto) {
      throw new BadRequestException('updateUserDto is required.');
    }
    const updatedUser = await this.userService.updateUser({
      updateUserDto,
      id,
    });

    return updatedUser;
  }

  @Get(':email')
  async show(@Param() { email }: FindOneByEmail) {
    if (!email) {
      throw new BadRequestException('email is required.');
    }
    const user = await this.userService.finOne(email);

    return deleteUserAtributes(user);
  }

  @Delete(':id')
  async delete(@Param() { id }: FindOneParams) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }
    const user = await this.userService.deleteUser(id);
    return user;
  }

  @Get()
  async index(@Query('offset') offset: number, @Query('limit') limit: number) {
    const users = await this.userService.findAllUsers({ limit, offset });
    return users;
  }
}
