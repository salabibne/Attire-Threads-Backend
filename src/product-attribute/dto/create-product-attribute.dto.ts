
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateProductAttributeDto {
  @IsString()
  @IsNotEmpty()
  imageBannar: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  imageGallery: string[];

  @IsString()
  @IsNotEmpty()
  productVariantId: string;
}
