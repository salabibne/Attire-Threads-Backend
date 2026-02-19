import { Module } from '@nestjs/common';
import { SkuService } from './sku.service.js';
import { SkuController } from './sku.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SkuController],
  providers: [SkuService],
})
export class SkuModule {}
