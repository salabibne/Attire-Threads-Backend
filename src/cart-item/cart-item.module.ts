import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service.js';
import { CartItemController } from './cart-item.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
