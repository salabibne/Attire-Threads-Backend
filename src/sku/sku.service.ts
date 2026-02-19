import { Injectable, NotFoundException, InternalServerErrorException, HttpStatus, ConflictException } from '@nestjs/common';
import { CreateSkuDto } from './dto/create-sku.dto.js';
import { UpdateSkuDto } from './dto/update-sku.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SkuService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create
  async create(createSkuDto: CreateSkuDto) {
    try {
      // Check if SKU code already exists
      const existingSku = await this.prisma.sKU.findUnique({
        where: { skuCode: createSkuDto.skuCode },
      });

      if (existingSku) {
        throw new ConflictException('SKU code already exists');
      }

      // Check if product exists
      const product = await this.prisma.product.findUnique({
        where: { id: createSkuDto.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Check if variant exists
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: createSkuDto.productVariantId },
      });

      if (!variant) {
        throw new NotFoundException('Product variant not found');
      }

      const sku = await this.prisma.sKU.create({
        data: createSkuDto,
        include: { product: true, productVariant: true },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'SKU created successfully',
        data: sku,
      };
    } catch (error) {
      console.error('Error creating SKU:', error);
      if (error instanceof NotFoundException || error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to create SKU');
    }
  }

  // ✅ Find All
  async findAll() {
    try {
      const skus = await this.prisma.sKU.findMany({
        include: { product: true, productVariant: true },
        orderBy: { skuCode: 'asc' },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SKUs fetched successfully',
        data: skus,
      };
    } catch (error) {
      console.error('Error fetching SKUs:', error);
      throw new InternalServerErrorException('Failed to fetch SKUs');
    }
  }

  // ✅ Find One
  async findOne(id: string) {
    try {
      const sku = await this.prisma.sKU.findUnique({
        where: { id },
        include: { product: true, productVariant: true },
      });

      if (!sku) {
        throw new NotFoundException('SKU not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'SKU fetched successfully',
        data: sku,
      };
    } catch (error) {
      console.error('Error fetching SKU:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch SKU');
    }
  }

  // ✅ Update
  async update(id: string, updateSkuDto: UpdateSkuDto) {
    try {
      const existing = await this.prisma.sKU.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('SKU not found');
      }

      if (updateSkuDto.skuCode) {
        const otherSku = await this.prisma.sKU.findFirst({
          where: { skuCode: updateSkuDto.skuCode, NOT: { id } },
        });
        if (otherSku) {
          throw new ConflictException('SKU code already exists');
        }
      }

      if (updateSkuDto.productId) {
        const product = await this.prisma.product.findUnique({
          where: { id: updateSkuDto.productId },
        });
        if (!product) throw new NotFoundException('Product not found');
      }

      if (updateSkuDto.productVariantId) {
        const variant = await this.prisma.productVariant.findUnique({
          where: { id: updateSkuDto.productVariantId },
        });
        if (!variant) throw new NotFoundException('Product variant not found');
      }

      const updated = await this.prisma.sKU.update({
        where: { id },
        data: updateSkuDto,
        include: { product: true, productVariant: true },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SKU updated successfully',
        data: updated,
      };
    } catch (error) {
      console.error('Error updating SKU:', error);
      if (error instanceof NotFoundException || error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to update SKU');
    }
  }

  // ✅ Delete
  async remove(id: string) {
    try {
      const existing = await this.prisma.sKU.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('SKU not found');
      }

      await this.prisma.sKU.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'SKU deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting SKU:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete SKU');
    }
  }
}
