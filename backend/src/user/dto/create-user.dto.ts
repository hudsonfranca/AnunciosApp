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
  @Length(9, 9)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  @IsDefined()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  @IsDefined()
  password: string;

  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  @IsDefined()
  passwordConfirmation: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
