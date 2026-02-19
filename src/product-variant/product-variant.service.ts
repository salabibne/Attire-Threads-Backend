import { Injectable, NotFoundException, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto.js';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductVariantService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create
  async create(createProductVariantDto: CreateProductVariantDto) {
    try {
      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: { id: createProductVariantDto.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const variant = await this.prisma.productVariant.create({
        data: createProductVariantDto,
        include: { product: true, skus: true },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product variant created successfully',
        data: variant,
      };
    } catch (error) {
      console.error('Error creating product variant:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to create product variant');
    }
  }

  // ✅ Find All
  async findAll() {
    try {
      const variants = await this.prisma.productVariant.findMany({
        include: { product: true, skus: true },
        orderBy: { name: 'asc' },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Product variants fetched successfully',
        data: variants,
      };
    } catch (error) {
      console.error('Error fetching variants:', error);
      throw new InternalServerErrorException('Failed to fetch variants');
    }
  }

  // ✅ Find One
  async findOne(id: string) {
    try {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id },
        include: { product: true, skus: true },
      });

      if (!variant) {
        throw new NotFoundException('Product variant not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Product variant fetched successfully',
        data: variant,
      };
    } catch (error) {
      console.error('Error fetching variant:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch variant');
    }
  }

  // ✅ Update
  async update(id: string, updateProductVariantDto: UpdateProductVariantDto) {
    try {
      const existing = await this.prisma.productVariant.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Product variant not found');
      }

      if (updateProductVariantDto.productId) {
        const product = await this.prisma.product.findUnique({
          where: { id: updateProductVariantDto.productId },
        });

        if (!product) {
          throw new NotFoundException('Product not found');
        }
      }

      const updated = await this.prisma.productVariant.update({
        where: { id },
        data: updateProductVariantDto,
        include: { product: true, skus: true },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Product variant updated successfully',
        data: updated,
      };
    } catch (error) {
      console.error('Error updating product variant:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update product variant');
    }
  }

  // ✅ Delete
  async remove(id: string) {
    try {
      const existing = await this.prisma.productVariant.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Product variant not found');
      }

      await this.prisma.productVariant.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Product variant deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting product variant:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete product variant');
    }
  }
}
