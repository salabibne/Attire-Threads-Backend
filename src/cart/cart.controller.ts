import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: any) {
    // req.user is populated by Passport from the JWT payload
    // In auth.service, payload.sub is the userId
    return this.cartService.getCart(req.user.sub);
  }

  @Post('add')
  async addToCart(@Req() req: any, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.sub, addToCartDto);
  }

  @Patch('item/:itemId')
  async updateCartItem(
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(itemId, updateCartItemDto);
  }

  @Delete('item/:itemId')
  async removeCartItem(@Param('itemId') itemId: string) {
    return this.cartService.removeCartItem(itemId);
  }

  @Delete('clear')
  async clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.sub);
  }
}
