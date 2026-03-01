import { Test, TestingModule } from '@nestjs/testing';
import { PromoProductsController } from './promo-products.controller.js';
import { PromoProductsService } from './promo-products.service.js';

describe('PromoProductsController', () => {
  let controller: PromoProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromoProductsController],
      providers: [PromoProductsService],
    }).compile();

    controller = module.get<PromoProductsController>(PromoProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
