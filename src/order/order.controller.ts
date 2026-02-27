import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  async checkout(@Req() req: any, @Body() checkoutDto: CheckoutDto) {
    return this.orderService.checkout(req.user.sub, checkoutDto);
  }

  @Get()
  async getOrders(@Req() req: any) {
    return this.orderService.getOrders(req.user.sub);
  }

  @Get(':id')
  async getOrder(@Req() req: any, @Param('id') id: string) {
    return this.orderService.getOrder(id, req.user.sub);
  }
}
