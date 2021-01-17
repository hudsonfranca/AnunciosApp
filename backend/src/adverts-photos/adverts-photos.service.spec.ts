import { Test, TestingModule } from '@nestjs/testing';
import { AdvertsPhotosService } from './adverts-photos.service';

describe('AdvertsPhotosService', () => {
  let service: AdvertsPhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertsPhotosService],
    }).compile();

    service = module.get<AdvertsPhotosService>(AdvertsPhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
