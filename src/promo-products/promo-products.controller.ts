import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PromoProductsService } from './promo-products.service.js';
import { CreatePromoProductDto } from './dto/create-promo-product.dto.js';
import { UpdatePromoProductDto } from './dto/update-promo-product.dto.js';

@Controller('promo-products')
export class PromoProductsController {
  constructor(private readonly promoProductsService: PromoProductsService) {}

  @Post()
  create(@Body() createPromoProductDto: CreatePromoProductDto) {
    return this.promoProductsService.create(createPromoProductDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.promoProductsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promoProductsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromoProductDto: UpdatePromoProductDto) {
    return this.promoProductsService.update(id, updatePromoProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promoProductsService.remove(id);
  }
}
