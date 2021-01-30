import { IsString, IsNotEmpty, Length, IsDefined } from 'class-validator';

export class ChangePasswordDto {
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
}
