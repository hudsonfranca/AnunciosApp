import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  IsDefined,
} from 'class-validator';

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  @IsDefined()
  password: string;
}
