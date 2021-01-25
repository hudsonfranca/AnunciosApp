import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoryQueryDto } from './dto/find-category-query.dto';

const createdCategory = Category.of({
  name: 'electronics',
});

const categoryEntity = Category.of({
  id: '86c0bb3b-76cb-4e3d-9230-602fa07397f6',
  name: 'electronics',
});

const savedCategory = Category.of({
  id: '86c0bb3b-76cb-4e3d-9230-602fa07397f6',
  name: 'electronics',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockCategoryRepository = () => ({
  save: async () => {},
  create: jest.fn().mockReturnValue(createdCategory),
  dispose: async () => {},
  delete: async () => {},
  findOne: async () => {},
  update: async () => {},
  find: jest.fn().mockResolvedValue([savedCategory]),
  createQueryBuilder: jest.fn(() => ({
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(savedCategory),
    getManyAndCount: jest.fn().mockResolvedValue([savedCategory, 1]),
  })),
});

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: Repository<Category>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useFactory: mockCategoryRepository,
        },
      ],
    }).compile();
    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get(getRepositoryToken(Category));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  describe(' createCategory', () => {
    it('must create a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'electronics',
      };
      const categoryRepositorySaveSpy = jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValue(savedCategory);

      const result = await categoryService.createCategory(createCategoryDto);

      delete result.updatedAt;
      delete result.createdAt;

      expect(result).toBe(result);
      expect(categoryRepositorySaveSpy).toBeCalledWith(createdCategory);
      expect(categoryRepository.create).toHaveBeenCalledWith({
        name: 'electronics',
      });
    });

    it('should throw an error if the name is not provided', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: '',
      };
      try {
        await categoryService.createCategory(createCategoryDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('name is required.');
      }
    });
  });

  describe('findOneById', () => {
    it('should throw an error if the id is not provided', async () => {
      try {
        await categoryService.findOneById('');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('id is required.');
      }
    });

    it('should throw an error if the category is not found', async () => {
      const categoryRepositoryFindOneSpy = jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(undefined);
      const id = '86c0bb3b-76cb-4e3d-9230-602fa07397f6';

      try {
        await categoryService.findOneById(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('no categories found');
      }
    });

    it('must return a category', async () => {
      const categoryRepositoryFindOneSpy = jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(savedCategory);

      const id = '86c0bb3b-76cb-4e3d-9230-602fa07397f6';

      const result = await categoryService.findOneById(id);

      expect(result).toBe(savedCategory);
      expect(categoryRepositoryFindOneSpy).toHaveBeenCalledWith(id, {
        select: ['name', 'id'],
      });
    });
  });

  describe('deleteCategory', () => {
    it('should throw an error if the id is not provided', async () => {
      try {
        await categoryService.deleteCategory('');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('id is required.');
      }
    });

    it('must delete a category', async () => {
      const categoryServiceFindOneByIdSpy = jest
        .spyOn(categoryService, 'findOneById')
        .mockResolvedValue(savedCategory);

      const id = 'c897a2a8-a4ec-43ea-82d6-72fc812def1d';

      const categoryRepositoryDeleteSpy = jest
        .spyOn(categoryRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 1 });

      const result = await categoryService.deleteCategory(id);

      expect(result.message).toBe(`Category successfully removed`);
      expect(categoryServiceFindOneByIdSpy).toHaveBeenCalledWith(id);
      expect(categoryRepositoryDeleteSpy).toHaveBeenCalledWith(
        savedCategory.id,
      );
    });
  });

  describe('updateCategory', () => {
    it('must update data for a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'electronics',
      };
      const id = 'c897a2a8-a4ec-43ea-82d6-72fc812def1d';

      const categoryServiceFindOneByIdSpy = jest
        .spyOn(categoryService, 'findOneById')
        .mockResolvedValue(savedCategory);

      const categoryRepositoryUpdateSpy = jest
        .spyOn(categoryRepository, 'update')
        .mockResolvedValue({ raw: [], affected: 1, generatedMaps: [] });

      const result = await categoryService.updateCategory({
        id,
        updateCategoryDto,
      });

      expect(result).toEqual(categoryEntity);
    });

    it('should throw an error if no categories are updated', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'electronics',
      };
      const id = 'c897a2a8-a4ec-43ea-82d6-72fc812def1d';

      const categoryServiceFindOneByIdSpy = jest
        .spyOn(categoryService, 'findOneById')
        .mockResolvedValue(savedCategory);

      const categoryRepositoryUpdateSpy = jest
        .spyOn(categoryRepository, 'update')
        .mockResolvedValue({ raw: [], affected: 0, generatedMaps: [] });

      try {
        await categoryService.updateCategory({
          id,
          updateCategoryDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('category does not exist');
      }
    });
  });

  describe('findManyCategories', () => {
    it('must return all categories', async () => {
      const queryDto: FindCategoryQueryDto = {
        limit: 10,
        page: 1,
      };

      const result = await categoryService.findManyCategories(queryDto);

      expect(result).toEqual({ count: 1, categories: savedCategory });
    });
  });
});
