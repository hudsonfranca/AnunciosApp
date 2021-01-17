import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class AdvertsId {
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  advertsId: string;
}
