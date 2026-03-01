import { Module } from '@nestjs/common';
import { PromoProductsService } from './promo-products.service.js';
import { PromoProductsController } from './promo-products.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PromoProductsController],
  providers: [PromoProductsService],
})
export class PromoProductsModule {}
