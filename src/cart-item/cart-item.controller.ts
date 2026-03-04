import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CartItemService } from './cart-item.service.js';
import { CreateCartItemDto } from './dto/create-cart-item.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('cart-items')
@UseGuards(JwtAuthGuard)
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.cartItemService.findAll(req.user.sub);
  }

  @Post()
  create(@Req() req: any, @Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.create(req.user.sub, createCartItemDto);
  }

  @Patch(':itemId')
  update(
    @Req() req: any,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.update(req.user.sub, itemId, updateCartItemDto);
  }

  @Delete(':itemId')
  remove(@Req() req: any, @Param('itemId') itemId: string) {
    return this.cartItemService.remove(req.user.sub, itemId);
  }
}
