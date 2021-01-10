import { EntityRepository, Repository } from 'typeorm';
import { PublicArea } from './public-area.entity';

@EntityRepository(PublicArea)
export class PublicAreaRepository extends Repository<PublicArea> {}
