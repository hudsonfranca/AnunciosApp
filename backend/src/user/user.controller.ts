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
import { FindOneByEmail } from './dto/find-one-by-email.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { deleteUserAtributes } from '../utils';
import { Role } from '../auth/decorators/roles.decorator';
import { UserRole } from './user-role';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Role(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser({
      createUserDto,
      role: UserRole.ADMIN,
    });

    return user;
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
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

  @Get(':email')
  @Role(UserRole.ADMIN)
  async show(@Param() { email }: FindOneByEmail) {
    if (!email) {
      throw new BadRequestException('email is required.');
    }
    const user = await this.userService.finOneByEmail(email);

    return deleteUserAtributes(user);
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async delete(@Param() { id }: FindOneParams) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }
    const user = await this.userService.deleteUser(id);
    return user;
  }

  @Get()
  @Role(UserRole.ADMIN)
  async index(@Query('offset') offset: number, @Query('limit') limit: number) {
    const users = await this.userService.findAllUsers({ limit, offset });
    return users;
  }
}
