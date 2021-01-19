import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { deleteCategoryAtributes } from '../utils/utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    if (!name) {
      throw new BadRequestException(' name is required.');
    }

    const categoryEntity = this.categoryRepository.create({ name });

    try {
      const category = await this.categoryRepository.save(categoryEntity);
      return deleteCategoryAtributes(category);
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException(`${categoryEntity.name} is already in use`);
      } else {
        throw new InternalServerErrorException('Could not save category.');
      }
    }
  }

  async findOneById(id: string) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }
    const category = await this.categoryRepository.findOne(id, {
      select: ['name', 'id'],
    });

    if (!category) {
      throw new NotFoundException('no categories found');
    }

    return category;
  }

  async findManyCategories(params: { limit: number; offset: number }) {
    const { limit, offset } = params;

    const categoryQuery = await this.categoryRepository.createQueryBuilder(
      'categories',
    );

    const count = await categoryQuery.getCount();

    const categories = await categoryQuery
      .select(['categories.id', 'categories.name'])
      .skip(offset)
      .take(limit)
      .getMany();

    if (!categories) {
      throw new NotFoundException('no categories found');
    }

    return { count, categories };
  }

  async deleteCategory(id: string) {
    if (!id) {
      throw new BadRequestException('id is required.');
    }

    const category = await this.findOneById(id);

    try {
      await this.categoryRepository.delete(category.id);
      return { message: `Category successfully removed` };
    } catch (error) {
      throw new InternalServerErrorException('could not delete the category.');
    }
  }

  async updateCategory(params: {
    id: string;
    updateCategoryDto: UpdateCategoryDto;
  }) {
    const {
      id,
      updateCategoryDto: { name },
    } = params;

    const category = await this.findOneById(id);

    category.name = name;

    const updatedCategory = await this.categoryRepository.update(
      { id: category.id },
      category,
    );

    if (updatedCategory.affected > 0) {
      const categoryEntity = await this.categoryRepository.findOne(category.id);

      return deleteCategoryAtributes(categoryEntity);
    } else {
      throw new NotFoundException(`category does not exist`);
    }
  }
}
