import {
  IsString,
  IsNotEmpty,
  Length,
  IsInt,
  IsDefined,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  @IsDefined()
  zip: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  @IsDefined()
  street: string;

  @IsInt()
  @IsNotEmpty()
  @IsDefined()
  number: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  @IsDefined()
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @IsDefined()
  uf: string;
}