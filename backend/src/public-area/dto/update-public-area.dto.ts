import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';

export class UpdatePublicAreaDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  name: string;
}
