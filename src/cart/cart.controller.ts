import { Controller, Get, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.sub);
  }

  @Delete('clear')
  async clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.sub);
  }
}
