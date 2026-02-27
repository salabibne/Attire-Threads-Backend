import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  subCategoryId: string;

  @IsString()
  @IsNotEmpty()
  defaultImageBanner: string;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  defaultImagesGallery: string[];

  @IsNotEmpty()
  defaultPrice: number;

  @IsNotEmpty()
  minPrice: number;
  @IsNotEmpty()
  maxPrice: number;

  
}
