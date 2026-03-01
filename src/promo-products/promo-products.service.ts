import { Injectable, NotFoundException, InternalServerErrorException, HttpStatus, BadRequestException } from '@nestjs/common';
import { CreatePromoProductDto } from './dto/create-promo-product.dto.js';
import { UpdatePromoProductDto } from './dto/update-promo-product.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { paginate10 } from '../common/pagination/pagination10.js';

@Injectable()
export class PromoProductsService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create
  async create(createPromoProductDto: CreatePromoProductDto) {
    try {
      // Check current limit status
      const currentLimit = createPromoProductDto.limit;

      // Check if products_id count exceeds current limit
      if (createPromoProductDto.products_id.length > currentLimit) {
        throw new BadRequestException(`Product IDs cannot exceed the limit of ${currentLimit}`);
      }

      // Check if each product ID exists
      for (const productId of createPromoProductDto.products_id) {
        const product = await this.prisma.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${productId} not found`);
        }
      }

      const record = await this.prisma.promoProducts.create({
        data: createPromoProductDto,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Promo product created successfully',
        data: record,
      };
    } catch (error) {
      console.error('Error creating promo product:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create promo product');
    }
  }

  // ✅ Find All
  async findAll(page: number, limit: number) {
    const { take, skip } = paginate10(page, limit);
    try {
      // Count total promo records with status true for pagination metadata
      const total = await this.prisma.promoProducts.count({
        where: { status: true },
      });

      const records = await this.prisma.promoProducts.findMany({
        where: { status: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      });

      // Fetch actual products for each promo record
      const recordsWithProducts = await Promise.all(
        records.map(async (rec) => {
          const products = await this.prisma.product.findMany({
            where: {
              id: {
                in: rec.products_id,
              },
            },
            orderBy: { createdAt: 'desc' },
          });

          return {
            ...rec,
            products,
          };
        })
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Promo products fetched successfully',
        data: recordsWithProducts,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching promo products:', error);
      throw new InternalServerErrorException('Failed to fetch promo products');
    }
  }

  // ✅ Find One
  async findOne(id: string) {
    try {
      const record = await this.prisma.promoProducts.findUnique({
        where: { id },
      });

      if (!record) {
        throw new NotFoundException('Promo product not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Promo product fetched successfully',
        data: record,
      };
    } catch (error) {
      console.error('Error fetching promo product:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch promo product');
    }
  }

  // ✅ Update
  async update(id: string, updatePromoProductDto: UpdatePromoProductDto) {
    try {
      // Check if record exists
      const existing = await this.prisma.promoProducts.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Promo product not found');
      }

      // Check if products_id is provided and validate
      if (updatePromoProductDto.products_id) {
        // Get current limit (use updated limit if provided, otherwise use existing limit)
        const limitToCheck = updatePromoProductDto.limit || existing.limit;

        // Check if products_id count exceeds current limit
        if (updatePromoProductDto.products_id.length > limitToCheck) {
          throw new BadRequestException(`Product IDs cannot exceed the limit of ${limitToCheck}`);
        }

        // Check if each product ID exists
        for (const productId of updatePromoProductDto.products_id) {
          const product = await this.prisma.product.findUnique({
            where: { id: productId },
          });

          if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
          }
        }
      }

      const updated = await this.prisma.promoProducts.update({
        where: { id },
        data: updatePromoProductDto,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Promo product updated successfully',
        data: updated,
      };
    } catch (error) {
      console.error('Error updating promo product:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to update promo product');
    }
  }

  // ✅ Delete
  async remove(id: string) {
    try {
      const existing = await this.prisma.promoProducts.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Promo product not found');
      }

      await this.prisma.promoProducts.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Promo product deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting promo product:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete promo product');
    }
  }
}
