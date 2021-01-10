import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreatePublicAreaDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  name: string;
}
