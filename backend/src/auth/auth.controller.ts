import {
  Controller,
  Post,
  UseGuards,
  Res,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.signin(req.user);
    res.cookie('authorization', token);
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
    const {token,user} = await this.authService.signup(createUserDto);

    res.cookie('authorization', token);
    return { user, token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('authorization', '');
    return { success: true };
  }

}
