import {
  BadRequestException,
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
import { Category } from 'src/category/category.entity';
import { deleteAdvertsAtributes, advertsSelectAtributes } from '../utils';

@Injectable()
export class AdvertsService {
  constructor(
    @InjectRepository(Adverts) private advertsRepository: Repository<Adverts>,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  async createAdverts(params: {
    createAdvertsDto: CreateAdvertsDto;
    userId: string;
  }) {
    const {
      createAdvertsDto: { categoryIds, ...adverts },
      userId,
    } = params;

    const categories: Category[] = [];

    categoryIds.map(async (id) => {
      const category = await this.categoryService.findOneById(id);
      categories.push(category);
    });

    const user = await this.userService.finOneById(userId);

    const advertsEntity = this.advertsRepository.create(adverts);

    advertsEntity.categories = categories;
    advertsEntity.user = user;

    try {
      const savedAdverts = await this.advertsRepository.save(advertsEntity);

      return deleteAdvertsAtributes(savedAdverts);
    } catch (error) {
      throw new InternalServerErrorException('adverts could not be saved.');
    }
  }

  async finOneById(id: string) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }

    const adverts = await this.advertsRepository
      .createQueryBuilder('adverts')
      .select(advertsSelectAtributes)
      .leftJoin('adverts.categories', 'category')
      .leftJoin('adverts.user', 'user')
      .getOne();
    if (!adverts) {
      throw new NotFoundException('no adverts found');
    }

    return adverts;
  }

  async findManyAdverts(params: { limit: number; offset: number }) {
    const { limit, offset } = params;

    const advertsQuery = await this.advertsRepository.createQueryBuilder(
      'adverts',
    );

    const count = await advertsQuery.getCount();

    const adverts = await advertsQuery
      .select(advertsSelectAtributes)
      .leftJoin('adverts.categories', 'category')
      .leftJoin('adverts.user', 'user')
      .skip(offset)
      .take(limit)
      .getMany();

    if (!adverts) {
      throw new NotFoundException('no adverts found');
    }

    return { count, adverts };
  }

  async updateAdverts(params: {
    updateAdvertsDto: UpdateAdvertsDto;
    id: string;
  }) {
    const {
      id,
      updateAdvertsDto: { name, price, description },
    } = params;

    const adverts = await this.advertsRepository.findOne(id);
    if (!adverts) {
      throw new NotFoundException('no adverts found');
    }

    adverts.description = description;
    adverts.name = name;
    adverts.price = price;

    const updatedAdverts = await this.advertsRepository.update(
      { id: adverts.id },
      adverts,
    );

    if (updatedAdverts.affected > 0) {
      const advertsEntity = await this.advertsRepository.findOne(adverts.id);

      return deleteAdvertsAtributes(advertsEntity);
    } else {
      throw new NotFoundException('no adverts found');
    }
  }

  async deleteAdverts(id: string) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }

    const adverts = await this.finOneById(id);

    try {
      await this.advertsRepository.delete(adverts.id);
      return { message: `Ads successfully removed` };
    } catch (error) {
      throw new InternalServerErrorException('could not delete the Ads.');
    }
  }
}
