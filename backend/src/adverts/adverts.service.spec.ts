import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { AdvertsService } from './adverts.service';
import { Adverts } from './adverts.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from '../address/address.entity';
import { CategoryService } from '../category/category.service';
import { CreateAdvertsDto } from './dto/create-adverts.dto';
import { FindAdvertsByUserQueryDto } from './dto/find-adverts-by-user-query.dto';
import { Category } from '../category/category.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindAdvertsQueryDto } from './dto/find-adverts-query.dto';
import { UpdateAdvertsDto } from './dto/update-adverts.dto';

const categoryEntity = Category.of({
  id: '86c0bb3b-76cb-4e3d-9230-602fa07397f6',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'Automobiles',
});

const FakeCategoryService = () => ({
  findOneById: jest.fn().mockResolvedValue(categoryEntity),
});

const userEntity = User.of({
  id: '2e35f06a-f398-4aa9-b6c0-3c26a61cf3de',
  name: 'Admin hg',
  email: 'admin@gmail.com',
  password: '12345678',
  phoneNumber: '123456789',
  status: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const FakeUserService = () => ({
  findOne: jest.fn().mockResolvedValue(userEntity),
});

const addressEntity = Address.of({
  zip: '11905000',
  city: 'Sao Paulo',
  number: 28,
  street: 'Rua A',
  uf: 'SP',
});

const advertsEntity = Adverts.of({
  name: 'Car',
  price: 300.9,
  description: 'description',
});

const savedAdverts = Adverts.of({
  id: 'c897a2a8-a4ec-43ea-82d6-72fc812def1d',
  name: 'Car',
  price: 300.9,
  description: 'description',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockAddressRepository = () => ({
  create: jest.fn().mockReturnValue(addressEntity),
});

const mockAdvertsRepository = () => ({
  save: async () => {},
  create: jest.fn().mockReturnValue(advertsEntity),
  dispose: async () => {},
  delete: async () => {},
  findOne: async () => {},
  update: async () => {},
  find: jest.fn().mockResolvedValue([savedAdverts]),
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
    getOne: jest.fn().mockResolvedValue(savedAdverts),
    getManyAndCount: jest.fn().mockResolvedValue([savedAdverts, 1]),
  })),
});

describe('AdvertsService', () => {
  let advertsService: AdvertsService;
  let advertsRepository: Repository<Adverts>;
  let addressRepository: Repository<Address>;
  let categoryService: CategoryService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdvertsService,
        {
          provide: getRepositoryToken(Adverts),
          useFactory: mockAdvertsRepository,
        },
        {
          provide: getRepositoryToken(Address),
          useFactory: mockAddressRepository,
        },
        {
          provide: CategoryService,
          useFactory: FakeCategoryService,
        },
        {
          provide: UserService,
          useFactory: FakeUserService,
        },
      ],
    }).compile();

    advertsService = module.get<AdvertsService>(AdvertsService);
    advertsRepository = module.get(getRepositoryToken(Adverts));
    addressRepository = module.get<Repository<Address>>(
      getRepositoryToken(Address),
    );
    categoryService = module.get<CategoryService>(CategoryService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(advertsService).toBeDefined();
    expect(advertsRepository).toBeDefined();
    expect(addressRepository).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('createAdverts', async () => {
    const createAdvertsDto: CreateAdvertsDto = {
      name: 'Car',
      price: 300.9,
      description: 'description',
      categoryIds: ['86c0bb3b-76cb-4e3d-9230-602fa07397f6'],
      address: {
        zip: '11905000',
        city: 'Sao Paulo',
        number: 28,
        street: 'Rua A',
        uf: 'SP',
      },
    };

    const userId = '2e35f06a-f398-4aa9-b6c0-3c26a61cf3de';
    const categoryId = '86c0bb3b-76cb-4e3d-9230-602fa07397f6';

    const advertsServiceFindOneByIdsSpy = jest
      .spyOn(advertsService, 'findOneById')
      .mockResolvedValue(savedAdverts);

    const advertsRepositorySaveSpy = jest
      .spyOn(advertsRepository, 'save')
      .mockResolvedValue(savedAdverts);

    const result = await advertsService.createAdverts({
      userId,
      createAdvertsDto,
    });

    expect(result).toBe(savedAdverts);
    expect(addressRepository.create).toHaveBeenCalledWith({
      zip: '11905000',
      city: 'Sao Paulo',
      number: 28,
      street: 'Rua A',
      uf: 'SP',
    });
    expect(categoryService.findOneById).toHaveBeenCalledWith(categoryId);
    expect(userService.findOne).toHaveBeenCalledWith({ id: userId });
    expect(advertsRepository.create).toHaveBeenCalledWith({
      name: 'Car',
      price: 300.9,
      description: 'description',
    });
    const adverts = advertsEntity;
    adverts.address = addressEntity;
    adverts.categories = [categoryEntity];
    adverts.user = userEntity;
    expect(advertsRepository.save).toHaveBeenCalledWith(adverts);
  });

  it('findOneByUser', async () => {
    const queryDto: FindAdvertsByUserQueryDto = {
      categoryId: '86c0bb3b-76cb-4e3d-9230-602fa07397f6',
      limit: 10,
      name: 'car',
      page: 2,
      price: 200.9,
    };

    const userId = '2e35f06a-f398-4aa9-b6c0-3c26a61cf3de';

    const result = await advertsService.findOneByUser(queryDto, userId);
    expect(result).toEqual([1, savedAdverts]);
  });

  describe('findOneById', () => {
    it('should throw an error if the id is not provided', async () => {
      try {
        await advertsService.findOneById('');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('id is required.');
      }
    });

    it('must return an ad', async () => {
      const userId = '2e35f06a-f398-4aa9-b6c0-3c26a61cf3de';

      const result = await advertsService.findOneById(userId);
      expect(result).toBe(savedAdverts);
    });
  });

  it('findAdverts', async () => {
    const queryDto: FindAdvertsQueryDto = {
      categoryId: '86c0bb3b-76cb-4e3d-9230-602fa07397f6',
      limit: 10,
      name: 'car',
      page: 2,
      price: 200.9,
      city: 'Sao Paulo',
      uf: 'SP',
    };

    const result = await advertsService.findAdverts(queryDto);
    expect(result).toEqual({ count: 1, adverts: savedAdverts });
  });

  describe('updateAdverts', () => {
    it('should throw an error if no advertisement was found', async () => {
      const updateAdvertsDto: UpdateAdvertsDto = {
        address: {
          zip: '11905000',
          city: 'Sao Paulo',
          number: 28,
          street: 'Rua A',
          uf: 'SP',
        },
        description: 'gfgfgfgfg',
        price: 300.9,
        name: 'car',
      };

      const id = '2864775c-08d5-4743-9485-7d586d84e906';

      const advertsRepositoryFindOneSpy = jest
        .spyOn(advertsRepository, 'findOne')
        .mockResolvedValue(undefined);

      try {
        await advertsService.updateAdverts({ id, updateAdvertsDto });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('no adverts found');
      }
    });

    it('must update the ad', async () => {
      const updateAdvertsDto: UpdateAdvertsDto = {
        address: {
          zip: '11905000',
          city: 'Sao Paulo',
          number: 28,
          street: 'Rua A',
          uf: 'SP',
        },
        description: 'gfgfgfgfg',
        price: 300.9,
        name: 'car',
      };

      const id = '2864775c-08d5-4743-9485-7d586d84e906';

      const advertsRepositoryFindOneSpy = jest
        .spyOn(advertsRepository, 'findOne')
        .mockResolvedValue(savedAdverts);

      const advertsServiceSaveAdvertsSpy = jest
        .spyOn(advertsService, 'saveAdverts')
        .mockResolvedValue(savedAdverts);

      const advertsServiceFindOneByIdsSpy = jest
        .spyOn(advertsService, 'findOneById')
        .mockResolvedValue(savedAdverts);

      expect(await advertsService.updateAdverts({ updateAdvertsDto, id })).toBe(
        savedAdverts,
      );
      expect(addressRepository.create).toBeCalledWith({
        zip: '11905000',
        city: 'Sao Paulo',
        number: 28,
        street: 'Rua A',
        uf: 'SP',
      });
      expect(advertsRepositoryFindOneSpy).toBeCalledWith(id);
    });
  });

  describe('saveAdverts', () => {
    it('', async () => {
      const advertsRepositorySaveSpy = jest
        .spyOn(advertsRepository, 'save')
        .mockResolvedValue(savedAdverts);

      expect(await advertsService.saveAdverts(advertsEntity)).toBe(
        savedAdverts,
      );

      expect(advertsRepositorySaveSpy).toBeCalledWith(advertsEntity);
    });
  });

  describe('deleteAdverts', () => {
    it('should throw an error if the id was not provided', async () => {
      try {
        await advertsService.deleteAdverts('');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('id is required.');
      }
    });

    it('must delete an adverts', async () => {
      const advertsServiceFindOneByIdsSpy = jest
        .spyOn(advertsService, 'findOneById')
        .mockResolvedValue(savedAdverts);

      const id = 'c897a2a8-a4ec-43ea-82d6-72fc812def1d';

      const advertsRepositoryDeleteSpy = jest
        .spyOn(advertsRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 1 });

      expect(await advertsService.deleteAdverts(id)).toEqual({
        message: `Ads successfully removed`,
      });

      expect(advertsRepositoryDeleteSpy).toHaveBeenCalledWith(id);
      expect(advertsServiceFindOneByIdsSpy).toHaveBeenCalledWith(id);
    });
  });
});
