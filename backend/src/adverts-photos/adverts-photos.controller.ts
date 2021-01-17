import {
  Controller,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdvertsId } from './dto/adverts-id.dto';
import { AdvertsPhotosService } from './adverts-photos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/user-role';
import { AdvertsService } from '../adverts/adverts.service';

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

@Controller('adverts-photos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdvertsPhotosController {
  constructor(
    private advertsPhotosService: AdvertsPhotosService,
    private advertsService: AdvertsService,
  ) {}

  @Post('adverts/:advertsId')
  @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
  @Role(UserRole.USER)
  async create(
    @Param() { advertsId }: AdvertsId,
    @UploadedFile() file: File,
    @Request() req,
  ) {
    const adverts = await this.advertsService.finOneById(advertsId);

    if (adverts.user.id !== req.user.id) {
      throw new UnauthorizedException();
    }
    const photo = await this.advertsPhotosService.createAdvertsPhoto({
      file,
      advertsId,
    });
    delete photo.createdAt;
    delete photo.updatedAt;
    return photo;
  }
}
