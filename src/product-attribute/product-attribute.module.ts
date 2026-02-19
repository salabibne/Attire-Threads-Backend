import { Module } from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service.js';
import { ProductAttributeController } from './product-attribute.controller.js';

@Module({
  controllers: [ProductAttributeController],
  providers: [ProductAttributeService],
})
export class ProductAttributeModule {}
