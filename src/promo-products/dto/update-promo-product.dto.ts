import { PartialType } from '@nestjs/mapped-types';
import { CreatePromoProductDto } from './create-promo-product.dto.js';

export class UpdatePromoProductDto extends PartialType(CreatePromoProductDto) {}
