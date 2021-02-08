import { BaseQueryParametersDto } from '../../shared/base-query-parameters.dto';

export class FindAdvertsQueryDto extends BaseQueryParametersDto {
  name: string;
  price?: number;
  city?: string;
  state?: string;
  neighborhood?:string;
  categoryId?: string;
}
