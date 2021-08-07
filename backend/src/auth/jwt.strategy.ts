import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { keys } from '../keys';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { deleteUserAtributes } from '../utils/utils';

const cookieExtractor = function (req: Request) {
  let token = null;

  if (req && req.cookies['authorization']) {
    token = req.cookies['authorization'];
  }
  
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_KEY}`,
    });
  }

  async validate(payload: any) {
    const { email, sub } = payload;
    
    const user = await this.userService.findOne({ email });
    
    return deleteUserAtributes(user);
  }
}
