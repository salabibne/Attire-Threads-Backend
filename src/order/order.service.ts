import { Injectable, NotFoundException, InternalServerErrorException, HttpStatus, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CheckoutDto } from './dto/checkout.dto.js';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: string, checkoutDto: CheckoutDto) {
    try {
      // 1. Get the user's cart
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              sku: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      // 2. Validate stock for all items
      for (const item of cart.items) {
        if (item.sku.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for SKU: ${item.sku.skuCode}`);
        }
      }

      // 3. Calculate total amount
      const totalAmount = cart.items.reduce((total, item) => {
        return total + item.sku.price * item.quantity;
      }, 0);

      // 4. Create Order and OrderItems in a transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // Create the order
        const order = await tx.order.create({
          data: {
            userId,
            totalAmount,
            address: checkoutDto.address,
            phone: checkoutDto.phone,
            status: 'PENDING',
            items: {
              create: cart.items.map((item) => ({
                skuId: item.skuId,
                quantity: item.quantity,
                price: item.sku.price,
              })),
            },
          },
          include: {
            items: true,
          },
        });

        // Update stock for each SKU
        for (const item of cart.items) {
          await tx.sKU.update({
            where: { id: item.skuId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Clear the cart items
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return order;
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error during checkout:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Failed to process checkout');
    }
  }

  async getOrders(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
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
        orderBy: { createdAt: 'desc' },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Orders fetched successfully',
        data: orders,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }

  async getOrder(orderId: string, userId: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
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

      if (!order || order.userId !== userId) {
        throw new NotFoundException('Order not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Order details fetched successfully',
        data: order,
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch order details');
    }
  }
}
