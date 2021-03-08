import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from './create-address.dto';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  @IsDefined()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  @IsDefined()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @IsDefined()
  password: string;


  @IsString()
  @IsNotEmpty()
  @Length(8)
  @IsDefined()
  passwordConfirmation: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
