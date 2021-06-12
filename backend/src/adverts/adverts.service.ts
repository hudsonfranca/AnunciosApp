import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adverts } from './adverts.entity';
import { CreateAdvertsDto } from './dto/create-adverts.dto';
import { UpdateAdvertsDto } from './dto/update-adverts.dto';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.entity';
import { advertsSelectAtributes } from '../utils/utils';
import { FindAdvertsQueryDto } from './dto/find-adverts-query.dto';
import { FindAdvertsByUserQueryDto } from './dto/find-adverts-by-user-query.dto';
import { Address } from '../address/address.entity';

@Injectable()
export class AdvertsService {
  constructor(
    @InjectRepository(Adverts) private advertsRepository: Repository<Adverts>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  async createAdverts(params: {
    createAdvertsDto: CreateAdvertsDto;
    userId: string;
  }) {
    const {
      createAdvertsDto: { categoryIds, address, ...adverts },
      userId,
    } = params;

    const categories: Category[] = [];

    const addressEntity = this.addressRepository.create({ ...address });

    categoryIds.map(async (id) => {
      const category = await this.categoryService.findOneById(id);
      categories.push(category);
    });

    const user = await this.userService.findOne({ id: userId });

    const advertsEntity = this.advertsRepository.create(adverts);
    advertsEntity.address = addressEntity;
    

    advertsEntity.categories = categories;
    advertsEntity.user = user;
    

    try {
      const savedAdverts = await this.advertsRepository.save(advertsEntity);

      return await this.findOneById(savedAdverts.id);
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('adverts could not be saved.');
    }
  }

  async findOneByUser(queryDto: FindAdvertsByUserQueryDto, userId: string) {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const { categoryId, price, name } = queryDto;

    const query = await this.advertsRepository.createQueryBuilder('adverts');

    query
      .select(advertsSelectAtributes)
      .leftJoin('adverts.categories', 'category')
      .leftJoin('adverts.address', 'address')
      .leftJoin('adverts.user', 'user')
      .leftJoin('adverts.advertsPhotos', 'adverts_photos');

    query.where('user.id = :userId', { userId });

    if (name) {
      query.andWhere('adverts.name ILIKE :name', { name: `%${name}%` });
    }

    if (price) {
      query.andWhere('adverts.price = :price', { price });
    }

    if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(queryDto.limit);

    query.orderBy(queryDto.sort ? JSON.stringify(queryDto.sort) : undefined);

    const [adverts, count] = await query.getManyAndCount();

    if (adverts.length === 0) {
      throw new NotFoundException('no adverts found');
    }

    return { count: count, adverts: adverts };
  }

  async findOneById(id: string) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }

    const adverts = await this.advertsRepository
      .createQueryBuilder('adverts')
      .select(advertsSelectAtributes)
      .leftJoin('adverts.categories', 'category')
      .leftJoin('adverts.address', 'address')
      .leftJoin('adverts.user', 'user')
      .leftJoin('adverts.advertsPhotos', 'adverts_photos')
      .where('adverts.id = :id', { id })
      .getOne();
    if (!adverts) {
      throw new NotFoundException('no adverts found');
    }

    return adverts;
  }

  async findAdverts(queryDto: FindAdvertsQueryDto) {
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const { city, categoryId, state, price, name ,neighborhood} = queryDto;

    const query = await this.advertsRepository.createQueryBuilder('adverts');

    query
      .select(advertsSelectAtributes)
      .leftJoin('adverts.categories', 'category')
      .leftJoin('adverts.address', 'address')
      .leftJoin('adverts.user', 'user')
      .leftJoin('adverts.advertsPhotos', 'adverts_photos');

      if(name){
        query.andWhere('adverts.name ILIKE :name', { name: `%${name}%` });
      }
   
    if (price) {
      query.andWhere('adverts.price = :price', { price });
    }

    if (city) {
      query.andWhere('address.city ILIKE :city', { city: `%${city}%` });
    }

    if (neighborhood) {
      query.andWhere('address.neighborhood ILIKE :neighborhood', { neighborhood: `%${neighborhood}%` });
    }

    if (state) {
      query.andWhere('address.state ILIKE :state', {state: `%${state}%` });
    }

    if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(queryDto.limit);

    query.orderBy(queryDto.sort ? JSON.stringify(queryDto.sort) : undefined);

    const [adverts, count] = await query.getManyAndCount();

    if (adverts.length === 0) {
      throw new NotFoundException('no adverts found');
    }

    return { count: count, adverts: adverts };
  }

  async updateAdverts(params: {
    updateAdvertsDto: UpdateAdvertsDto;
    id: string;
  }) {
    const {
      id,
      updateAdvertsDto: {
        name,
        price,
        description,
        address: { city, neighborhood, number, state, street, zip },
      },
    } = params;

    const adverts = await this.findOneById(id);
   

    adverts.description = description ? description : adverts.description;
    adverts.name = name ? name : adverts.description;
    adverts.price = price ? price : adverts.price;
    adverts.address.city = city ? city : adverts.address.city;
    adverts.address.number = number ? number : adverts.address.number;
    adverts.address.street = street ? street : adverts.address.street;
    adverts.address.zip = zip ? zip : adverts.address.zip;
    adverts.address.state = state ? state : adverts.address.state;
    adverts.address.neighborhood = neighborhood
      ? neighborhood
      : adverts.address.neighborhood;

    const updatedAdverts = await this.saveAdverts(adverts);
    return this.findOneById(updatedAdverts.id);
  }

  async saveAdverts(adverts: Adverts) {
    try {
      const savedAdverts = await this.advertsRepository.save(adverts);
      return savedAdverts;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException(`email is already in use`);
      } else {
        throw new InternalServerErrorException('Could not save Adverts.');
      }
    }
  }

  async deleteAdverts(id: string) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }

    const adverts = await this.findOneById(id);

    try {
      await this.advertsRepository.delete(adverts.id);
      return { message: `Ads successfully removed` };
    } catch (error) {
      throw new InternalServerErrorException('could not delete the Ads.');
    }
  }
}
