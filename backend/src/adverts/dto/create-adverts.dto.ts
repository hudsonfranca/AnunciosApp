import {
  IsString,
  IsNotEmpty,
  Length,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from './create-address.dto';

export class CreateAdvertsDto {
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

  @IsNotEmpty()
  @IsDefined()
  categoryIds: string[];

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}
