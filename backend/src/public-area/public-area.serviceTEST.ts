import { Test, TestingModule } from '@nestjs/testing';
import { PublicAreaService } from './public-area.service';
import { CreatePublicAreaDto } from './dto/create-public-area.dto';
import { UpdatePublicAreaDto } from './dto/update-public-area.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PublicArea } from './public-area.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PublicAreaRepositoryFake } from './public-area-repository-fake';

describe('Public area service', () => {
  let publicAreaService: PublicAreaService;
  let publicAreaRepository: Repository<PublicArea>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicAreaService,
        {
          provide: getRepositoryToken(PublicArea),
          useClass: PublicAreaRepositoryFake,
        },
      ],
    }).compile();

    publicAreaService = module.get<PublicAreaService>(PublicAreaService);
    publicAreaRepository = module.get(getRepositoryToken(PublicArea));
  });

  describe('creating a public area', () => {
    it('calls the repository with correct paramaters', async () => {
      const name = 'Hudson';

      const createPublicAreaData: CreatePublicAreaDto = {
        name,
      };

      const createdPublicAreaEntity = PublicArea.of(createPublicAreaData);

      const savedPublicArea = PublicArea.of({
        id: '978a23e0-04b2-4a27-8c5d-3d4182d269ff',
        createdAt: new Date(),
        updatedAt: new Date(),
        name,
      });

      const publicAreaRepositorySaveSpay = jest
        .spyOn(publicAreaRepository, 'save')
        .mockResolvedValue(savedPublicArea);

      const publicAreaRepositoryCreateSpay = jest
        .spyOn(publicAreaRepository, 'create')
        .mockReturnValue();

      const result = await publicAreaService.CreatePublicArea(
        createPublicAreaData,
      );

      expect(publicAreaRepositoryCreateSpay).toBeCalledWith(
        createPublicAreaData,
      );
      expect(publicAreaRepositorySaveSpay).toBeCalledWith(
        createdPublicAreaEntity,
      );
      expect(result).toEqual(savedPublicArea);
    });
  });

  describe('Find Many', () => {
    it('must call the repository correctly', async () => {
      const findPublicAreas = PublicArea.of({
        id: '978a23e0-04b2-4a27-8c5d-3d4182d269ff',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Hudson',
      });

      const publicAreaRepositoryFindSpy = jest
        .spyOn(publicAreaRepository, 'find')
        .mockResolvedValue([findPublicAreas]);

      const result = await publicAreaService.findMany();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...findPublicAreas,
          }),
        ]),
      );
      expect(publicAreaRepositoryFindSpy).toHaveBeenCalledTimes(1);
    });

    it('throws an error when no public area is found', async () => {
      const publicAreaRepositoryFindSpy = jest
        .spyOn(publicAreaRepository, 'find')
        .mockResolvedValue(null);

      try {
        await publicAreaService.findMany();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No public area found');
      }
    });
  });
  describe('Find One', () => {
    it('throws an error when no id is provided', async () => {
      const id = '';
      try {
        await publicAreaService.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('id is required.');
      }
    });
    it('throws an error when no public area is found', async () => {
      const publicAreaRepositoryFindSpy = jest
        .spyOn(publicAreaRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        const id = '978a23e0-04b2-4a27-8c5d-3d4182d269ff';

        await publicAreaService.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No public area found');
      }
    });

    it('calls the repository with correct paramaters', async () => {
      const id = '978a23e0-04b2-4a27-8c5d-3d4182d269ff';
      const findOnePublicArea = PublicArea.of({
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Hudson',
      });
      const publicAreaRepositoryFindOneSpy = jest
        .spyOn(publicAreaRepository, 'findOne')
        .mockResolvedValue(findOnePublicArea);

      const result = await publicAreaService.findOne(id);

      expect(result).toEqual(findOnePublicArea);
      expect(publicAreaRepositoryFindOneSpy).toBeCalledWith(id);
    });
  });

  describe('Update', () => {
    it('should return affected > 0 if user data is updated ', async () => {
      const createPublicAreaDto: CreatePublicAreaDto = {
        name: 'Marcos',
      };

      const publicAreaEntity = PublicArea.of(createPublicAreaDto);

      const updatePublicAreaDto: UpdatePublicAreaDto = {
        name: 'Hudson',
      };
      const publicAreaRepositoryUpdateSpy = jest
        .spyOn(publicAreaRepository, 'update')
        .mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

      const publicAreaRepositoryFindOneSpy = jest
        .spyOn(publicAreaRepository, 'findOne')
        .mockResolvedValue(publicAreaEntity);

      const id = '978a23e0-04b2-4a27-8c5d-3d4182d269ff';

      const result = await publicAreaService.update(updatePublicAreaDto, id);

      expect(result).toEqual(publicAreaEntity);
      expect(publicAreaRepositoryUpdateSpy).toHaveBeenCalledWith(
        { id },
        updatePublicAreaDto,
      );
      expect(publicAreaRepositoryFindOneSpy).toHaveBeenCalled();
    });

    it('Throws an error if no public areas are updated', async () => {
      const updatePublicAreaDto: UpdatePublicAreaDto = {
        name: 'Hudson',
      };
      const publicAreaRepositoryUpdateSpy = jest
        .spyOn(publicAreaRepository, 'update')
        .mockResolvedValue({ affected: 0, raw: [], generatedMaps: [] });

      try {
        const id = '978a23e0-04b2-4a27-8c5d-3d4182d269ff';
        await publicAreaService.update(updatePublicAreaDto, id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('public area does not exist');
      }
    });

    it('throws an error when no id is provided', async () => {
      const id = '';
      const updatePublicAreaDto: UpdatePublicAreaDto = {
        name: 'Hudson',
      };
      try {
        await publicAreaService.update(updatePublicAreaDto, id);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('id is required.');
      }
    });
  });

  describe('Delete', () => {
    it('throws an error when no id is provided', async () => {
      const id = '';
      try {
        await publicAreaService.delete(id);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('id is required.');
      }
    });

    it('throws an error when no public area is found', async () => {
      const publicAreaRepositoryFindOneSpy = jest
        .spyOn(publicAreaRepository, 'findOne')
        .mockResolvedValue(null);

      try {
        const id = '978a23e0-04b2-4a27-8c5d-3d4182d269ff';

        await publicAreaService.delete(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('public area does not exist');
      }
    });

    it('must delete the public area', async () => {
      const id = '978a23e0-04b2-4a27-8c5d-3d4182d269ff';

      const findOnePublicArea = PublicArea.of({
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'hudson',
      });

      const publicAreaRepositoryFindOneSpy = jest
        .spyOn(publicAreaRepository, 'findOne')
        .mockResolvedValue(findOnePublicArea);

      const publicAreaRepositoryDeleteSpy = jest
        .spyOn(publicAreaRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 1 });

      const successMessage = { message: `public area successfully removed` };

      const result = await publicAreaService.delete(id);

      expect(result).toEqual(successMessage);
      expect(publicAreaRepositoryDeleteSpy).toHaveBeenCalledWith(id);
      expect(publicAreaRepositoryFindOneSpy).toHaveBeenCalledWith(id);
    });
  });
});
