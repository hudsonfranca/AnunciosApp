import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  name: string;
}
