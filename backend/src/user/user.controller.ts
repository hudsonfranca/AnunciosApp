import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
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
import { MailerService } from '@nestjs-modules/mailer';
import { keys } from 'src/keys';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private mailerService: MailerService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.VERIFIED_EMAIL)
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser({
      createUserDto,
      roles: [UserRole.ADMIN],
    });

    const email = {
      to: user.email,
      from: keys.emailAddress,
      subject: 'Email de confirmação',
      template: 'email-confirmation',
      context: {
        token: user.confirmationToken,
      },
    };

    try {
      await this.mailerService.sendMail(email);
    } catch (error) {
      throw new InternalServerErrorException(
        'confirmation email cannot be sent',
      );
    }

    delete user.recoverToken;
    delete user.confirmationToken;

    return user;
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.VERIFIED_EMAIL)
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
  @Roles(UserRole.ADMIN, UserRole.VERIFIED_EMAIL)
  async show(@Param() { id }: FindOneParams) {
    if (!id) {
      throw new BadRequestException('email is required.');
    }
    const user = await this.userService.findOne({ id });

    return user.roles;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.VERIFIED_EMAIL)
  async delete(@Param() { id }: FindOneParams) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }
    const user = await this.userService.deleteUser(id);
    return user;
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.VERIFIED_EMAIL)
  async index(@Query('offset') offset: number, @Query('limit') limit: number) {
    const users = await this.userService.findAllUsers({ limit, offset });
    return users;
  }
}
