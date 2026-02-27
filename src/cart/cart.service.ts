import { Injectable, NotFoundException, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    try {
      let cart = await this.prisma.cart.findUnique({
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

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { userId },
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
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Cart fetched successfully',
        data: cart,
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw new InternalServerErrorException('Failed to fetch cart');
    }
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    try {
      const { skuId, quantity } = addToCartDto;

      // Ensure cart exists
      let cart = await this.prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { userId },
        });
      }

      // Check if SKU exists and has stock
      const sku = await this.prisma.sKU.findUnique({
        where: { id: skuId },
      });

      if (!sku) {
        throw new NotFoundException('SKU not found');
      }

      if (sku.stock < quantity) {
        throw new InternalServerErrorException('Insufficient stock');
      }

      // Check if item already in cart
      const existingItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          skuId: skuId,
        },
      });

      if (existingItem) {
        const updatedItem = await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
        return {
          statusCode: HttpStatus.OK,
          message: 'Cart item updated',
          data: updatedItem,
        };
      } else {
        const newItem = await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            skuId: skuId,
            quantity: quantity,
          },
        });
        return {
          statusCode: HttpStatus.CREATED,
          message: 'Item added to cart',
          data: newItem,
        };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message || 'Failed to add item to cart');
    }
  }

  async updateCartItem(itemId: string, updateCartItemDto: UpdateCartItemDto) {
    try {
      const item = await this.prisma.cartItem.findUnique({
        where: { id: itemId },
        include: { sku: true },
      });

      if (!item) {
        throw new NotFoundException('Cart item not found');
      }

      if (item.sku.stock < updateCartItemDto.quantity) {
        throw new InternalServerErrorException('Insufficient stock');
      }

      const updated = await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: updateCartItemDto.quantity },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Cart item updated',
        data: updated,
      };
    } catch (error) {
      console.error('Error updating cart item:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update cart item');
    }
  }

  async removeCartItem(itemId: string) {
    try {
      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Cart item removed',
      };
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw new InternalServerErrorException('Failed to remove cart item');
    }
  }

  async clearCart(userId: string) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
      });

      if (cart) {
        await this.prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Cart cleared successfully',
      };
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new InternalServerErrorException('Failed to clear cart');
    }
  }
}
