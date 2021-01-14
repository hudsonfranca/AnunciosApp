import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class FindOneByEmail {
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;
}
