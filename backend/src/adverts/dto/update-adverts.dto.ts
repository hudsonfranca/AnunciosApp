import {
  IsString,
  IsNotEmpty,
  Length,
  IsDefined,
  IsDecimal,
} from 'class-validator';

export class UpdateAdvertsDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  @IsDefined()
  name: string;

  @IsNotEmpty()
  @IsDefined()
  @IsDecimal()
  price: number;

  @IsNotEmpty()
  @IsDefined()
  description: string;
}
