import {
  Controller,
  Post,
  UseGuards,
  Res,
  Request,
  Body,
  Param,
  Patch,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.signin(req.user);
    res.cookie('access_token', token, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
    });
    return { success: true, token: token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  async currentUser(@Request() req){
    delete req.user.confirmationToken;
    delete req.user.recoverToken;
      return  req.user;
  }

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signup(createUserDto);

    res.cookie('access_token', token, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
    });
    return { success: true, token: token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '');
    return { success: true };
  }

  @Patch('confirm-email/:token')
  async confirmEmail(@Param('token') token: string) {
    await this.authService.confirmEmail(token);
    return { message: 'Email has been validated' };
  }

  @Post('recovery-email')
  async sendPasswordRecoveryEmail(@Body('email') email: string) {
    await this.authService.sendPasswordRecoveryEmail(email);

    return {
      message: 'password recovery email sent successfully',
    };
  }

  @Patch('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.resetPassword({
      recoverToken: token,
      changePasswordDto,
    });

    return { message: 'password reset successfully' };
  }
}
