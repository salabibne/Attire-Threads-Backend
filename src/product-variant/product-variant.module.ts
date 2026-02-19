import { Module } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service.js';
import { ProductVariantController } from './product-variant.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
})
export class ProductVariantModule {}
