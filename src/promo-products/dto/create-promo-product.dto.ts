import { IsString, IsNotEmpty, IsBoolean, IsInt, IsArray, ArrayMaxSize } from 'class-validator';

export class CreatePromoProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @IsInt()
  @IsNotEmpty()
  limit: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(8)
  @IsNotEmpty()
  products_id: string[];
}
