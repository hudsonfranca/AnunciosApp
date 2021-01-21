import { BaseQueryParametersDto } from '../../shared/base-query-parameters.dto';

export class FindAdvertsQueryDto extends BaseQueryParametersDto {
  name: string;
  price: number;
  city: string;
  uf: string;
  categoryId: string;
}
