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
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { FindOneParams } from './dto/find-one.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './user-role';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FindAdvertsQueryDto } from 'src/adverts/dto/find-adverts-query.dto';
import { deleteUserAtributes } from 'src/utils/utils';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN )
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser({
      createUserDto,
      roles: [UserRole.ADMIN],
    });

    return user;
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param() { id }: FindOneParams,
    @Body() updateUserDto: UpdateUserDto,
  ) {
  
    if (id !== req.user.id) {
      throw new UnauthorizedException();
    }
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

  @Get(':id')
  async show(@Param() { id }: FindOneParams) {
    if (!id) {
      throw new BadRequestException('email is required.');
    }
    const user = await this.userService.findOne({ id });

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
  async index(@Query() query: FindAdvertsQueryDto) {
    const users = await this.userService.findAllUsers(query);
    return users;
  }
}
