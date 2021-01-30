import {
  IsString,
  IsNotEmpty,
  Length,
  IsDefined,
  IsDecimal,
  IsNotEmptyObject,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { CreateAddressDto } from './create-address.dto';
import { Type } from 'class-transformer';

export class UpdateAdvertsDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  @IsDefined()
  name: string;

  @IsNotEmpty()
  @IsDefined()
  price: number;

  @IsNotEmpty()
  @IsDefined()
  description: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
