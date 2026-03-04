import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCartItemDto } from './dto/create-cart-item.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';

@Injectable()
export class CartItemService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              sku: {
                include: {
                  product: true,
                  productVariant: true,
                },
              },
            },
          },
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Cart items fetched successfully',
        data: cart?.items ?? [],
      };
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw new InternalServerErrorException('Failed to fetch cart items');
    }
  }

  async create(userId: string, createCartItemDto: CreateCartItemDto) {
    try {
      const { skuId, quantity } = createCartItemDto;

      let cart = await this.prisma.cart.findUnique({ where: { userId } });

      if (!cart) {
        cart = await this.prisma.cart.create({ data: { userId } });
      }

      const sku = await this.prisma.sKU.findUnique({
        where: { id: skuId },
      });

      if (!sku) {
        throw new NotFoundException('SKU not found');
      }

      const existingItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          skuId,
        },
      });

      const nextQuantity = existingItem ? existingItem.quantity + quantity : quantity;

      if (sku.stock < nextQuantity) {
        throw new BadRequestException('Insufficient stock');
      }

      const item = existingItem
        ? await this.prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: nextQuantity },
          })
        : await this.prisma.cartItem.create({
            data: {
              cartId: cart.id,
              skuId,
              quantity,
            },
          });

      return {
        statusCode: existingItem ? HttpStatus.OK : HttpStatus.CREATED,
        message: existingItem ? 'Cart item updated successfully' : 'Cart item created successfully',
        data: item,
      };
    } catch (error) {
      console.error('Error creating cart item:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Failed to create cart item');
    }
  }

  async update(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto) {
    try {
      const item = await this.prisma.cartItem.findUnique({
        where: { id: itemId },
        include: {
          cart: true,
          sku: true,
        },
      });

      if (!item || item.cart.userId !== userId) {
        throw new NotFoundException('Cart item not found');
      }

      if (item.sku.stock < updateCartItemDto.quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      const updated = await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: updateCartItemDto.quantity },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Cart item updated successfully',
        data: updated,
      };
    } catch (error) {
      console.error('Error updating cart item:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update cart item');
    }
  }

  async remove(userId: string, itemId: string) {
    try {
      const item = await this.prisma.cartItem.findUnique({
        where: { id: itemId },
        include: {
          cart: true,
        },
      });

      if (!item || item.cart.userId !== userId) {
        throw new NotFoundException('Cart item not found');
      }

      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Cart item deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting cart item:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete cart item');
    }
  }
}
