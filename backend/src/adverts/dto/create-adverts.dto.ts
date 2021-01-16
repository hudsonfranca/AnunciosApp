import {
  IsString,
  IsNotEmpty,
  Length,
  IsUUID,
  IsDefined,
  IsDecimal,
} from 'class-validator';

export class CreateAdvertsDto {
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

  @IsUUID('4', { each: true })
  @IsNotEmpty()
  @IsDefined()
  categoryIds: string[];
}
