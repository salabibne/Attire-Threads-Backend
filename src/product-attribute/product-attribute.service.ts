import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto.js';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductAttributeService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create
  async create(createDto: CreateProductAttributeDto) {
    try {
      // Check if product variant exists
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: createDto.productVariantId },
      });

      if (!variant) {
        throw new NotFoundException('Product variant not found');
      }

      const imageAttribute = await this.prisma.productImageAttribute.create({
        data: createDto,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product image attribute created successfully',
        data: imageAttribute,
      };
    } catch (error) {
      console.error('Error creating product image attribute:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Failed to create product image attribute',
      );
    }
  }

  // ✅ Find All
  async findAll() {
    try {
      const data = await this.prisma.productImageAttribute.findMany({
        include: {
          productVariant: true,
        },
        orderBy: { id: 'desc' },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Product image attributes fetched successfully',
        data,
      };
    } catch (error) {
      console.error('Error fetching product image attributes:', error);
      throw new InternalServerErrorException(
        'Failed to fetch product image attributes',
      );
    }
  }

  // ✅ Find One
  async findOne(id: string) {
    try {
      const data = await this.prisma.productImageAttribute.findUnique({
        where: { id },
        include: {
          productVariant: true,
        },
      });

      if (!data) {
        throw new NotFoundException('Product image attribute not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Product image attribute fetched successfully',
        data,
      };
    } catch (error) {
      console.error('Error fetching product image attribute:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Failed to fetch product image attribute',
      );
    }
  }
async findOneByVariantId(variantId: string) {
    try {
      const data = await this.prisma.productImageAttribute.findFirst({
        where: { productVariantId: variantId },
        include: {
          productVariant: true,
        },
      });
        if (!data) {
        throw new NotFoundException('Product image attribute not found for this variant');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Product image attribute fetched successfully',
        data,
      };
    } catch (error) {
      console.error('Error fetching product image attribute by variant ID:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failed to fetch product image attribute by variant ID',
      );
    }
}
  // ✅ Update
  async update(id: string, updateDto: UpdateProductAttributeDto) {
    try {
      const existing = await this.prisma.productImageAttribute.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Product image attribute not found');
      }

      // If productVariantId is being changed, validate it
      if (updateDto.productVariantId) {
        const variant = await this.prisma.productVariant.findUnique({
          where: { id: updateDto.productVariantId },
        });

        if (!variant) {
          throw new NotFoundException('Product variant not found');
        }
      }

      const updated = await this.prisma.productImageAttribute.update({
        where: { id },
        data: updateDto,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Product image attribute updated successfully',
        data: updated,
      };
    } catch (error) {
      console.error('Error updating product image attribute:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Failed to update product image attribute',
      );
    }
  }

  // ✅ Delete
  async remove(id: string) {
    try {
      const existing = await this.prisma.productImageAttribute.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Product image attribute not found');
      }

      await this.prisma.productImageAttribute.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Product image attribute deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting product image attribute:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Failed to delete product image attribute',
      );
    }
  }
}
