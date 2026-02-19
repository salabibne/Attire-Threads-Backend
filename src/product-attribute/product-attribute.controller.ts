import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service.js';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto.js';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto.js';

@Controller('product-attribute')
export class ProductAttributeController {
  constructor(private readonly productAttributeService: ProductAttributeService) {}

  @Post()
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributeService.create(createProductAttributeDto);
  }

  @Get()
  findAll() {
    return this.productAttributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productAttributeService.findOne(id);
  }

  @Get('variant/:variantId')
  findOneByVariantId(@Param('variantId') variantId: string) {
    return this.productAttributeService.findOneByVariantId(variantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductAttributeDto: UpdateProductAttributeDto) {
    return this.productAttributeService.update(id, updateProductAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productAttributeService.remove(id);
  }
}
