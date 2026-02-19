import { PartialType } from '@nestjs/mapped-types';
import { CreateProductAttributeDto } from './create-product-attribute.dto.js';

export class UpdateProductAttributeDto extends PartialType(CreateProductAttributeDto) {}
