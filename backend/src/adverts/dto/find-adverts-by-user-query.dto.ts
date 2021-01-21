import { BaseQueryParametersDto } from '../../shared/base-query-parameters.dto';

export class FindAdvertsByUserQueryDto extends BaseQueryParametersDto {
  name: string;
  price: number;
  categoryId: string;
}
