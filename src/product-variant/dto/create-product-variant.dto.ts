import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;
}
