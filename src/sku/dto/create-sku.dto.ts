import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateSkuDto {
  @IsString()
  @IsNotEmpty()
  skuCode: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  productVariantId: string;
}
