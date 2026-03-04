import {
  Injectable,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

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
