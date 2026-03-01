import { Test, TestingModule } from '@nestjs/testing';
import { PromoProductsService } from './promo-products.service.js';

describe('PromoProductsService', () => {
  let service: PromoProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromoProductsService],
    }).compile();

    service = module.get<PromoProductsService>(PromoProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
