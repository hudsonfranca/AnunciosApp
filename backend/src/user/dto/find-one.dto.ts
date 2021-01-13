import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneParams {
  @IsUUID()
  @IsNotEmpty()
  @IsDefined()
  id: string;
}
