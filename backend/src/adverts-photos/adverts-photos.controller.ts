import {
  Controller,
  Param,
  Post,
  Request,
 
  UploadedFile,

  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdvertsId } from './dto/adverts-id.dto';
import { AdvertsPhotosService } from './adverts-photos.service';
import { AdvertsService } from '../adverts/adverts.service';
import { diskStorage } from  'multer';
import { extname,resolve } from  'path';
import * as crypto from 'crypto';

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
// @UseGuards(JwtAuthGuard)
export class AdvertsPhotosController {
  constructor(
    private advertsPhotosService: AdvertsPhotosService,
    private advertsService: AdvertsService,
  ) {}

  @Post('adverts/:advertsId')
  @UseInterceptors(FileInterceptor('file' ,{storage:diskStorage({
    destination:resolve(__dirname, "..", "..", "uploads"),
    filename:(req,file,cb)=>{
     crypto.randomBytes(16,(err,res)=>{
       if(err){
         return cb(err,null);
       }
       return cb(
         null,
         res.toString('hex')+extname(file.originalname)
       )
     })
     
    }
  })}))
  async create(
    @Param() { advertsId }: AdvertsId,
    @UploadedFile() file: File,
    @Request() req,
  ) {
  
    await this.advertsService.findOneById(advertsId);

    // if (adverts.user.id !== req.user.id) {
    //   throw new UnauthorizedException();
    // }
    const photo = await this.advertsPhotosService.createAdvertsPhoto({
      file,
      advertsId,
    });
    delete photo.createdAt;
    delete photo.updatedAt;
    return photo;
  }
}
