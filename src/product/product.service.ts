import { Injectable, NotFoundException, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create
  async create(createProductDto: CreateProductDto) {
    try {
      // Check if subcategory exists
      const subCategory = await this.prisma.subCategory.findUnique({
        where: { id: createProductDto.subCategoryId },
      });

      if (!subCategory) {
        throw new NotFoundException('Subcategory not found');
      }

      const product = await this.prisma.product.create({
        data: createProductDto,
        include: { subCategory: true, variants: true, skus: true },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      console.error('Error creating product:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  // ✅ Find All
  async findAll() {
    try {
      const products = await this.prisma.product.findMany({
        include: { subCategory: true, variants: true, skus: true },
        orderBy: { createdAt: 'desc' },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Products fetched successfully',
        data: products,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  // ✅ Find One
  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: { subCategory: true, variants: true, skus: true },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Product fetched successfully',
        data: product,
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch product');
    }
  }

  // ✅ Update
  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const existing = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Product not found');
      }

      if (updateProductDto.subCategoryId) {
        const subCategory = await this.prisma.subCategory.findUnique({
          where: { id: updateProductDto.subCategoryId },
        });

        if (!subCategory) {
          throw new NotFoundException('Subcategory not found');
        }
      }

      const updated = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: { subCategory: true, variants: true, skus: true },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Product updated successfully',
        data: updated,
      };
    } catch (error) {
      console.error('Error updating product:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  // ✅ Delete
  async remove(id: string) {
    try {
      const existing = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Product not found');
      }

      await this.prisma.product.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
