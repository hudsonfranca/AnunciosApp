import {
  Controller,
  Post,
  UseGuards,
  Res,
  Request,
  Get,
  Req,
} from '@nestjs/common';
import { Request as expressReq, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

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
  @Get('profile')
  getProfile(@Req() req: expressReq) {
    return req.user;
  }
}
