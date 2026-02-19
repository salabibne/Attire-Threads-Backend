import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto.js';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto.js';

@Injectable()
export class SubcategoryService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create
  async create(createSubcategoryDto: CreateSubcategoryDto) {
    try {
      // Check if subcategory name already exists
      const existing = await this.prisma.subCategory.findUnique({
        where: { name: createSubcategoryDto.name },
      });

      if (existing) {
        throw new InternalServerErrorException(
          'Subcategory with this name already exists',
        );
      }

      // Check if parent category exists
      const category = await this.prisma.category.findUnique({
        where: { id: createSubcategoryDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Parent category not found');
      }

      const subcategory = await this.prisma.subCategory.create({
        data: createSubcategoryDto,
        include: { category: true, products: true },

      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Subcategory created successfully',
        data: subcategory,
      };
    } catch (error) {
      console.error('Error creating subcategory:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to create subcategory');
    }
  }

  // ✅ Find All
  async findAll() {
    try {
      const subcategories = await this.prisma.subCategory.findMany({
        include: {
          category: true,
          products: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Subcategories fetched successfully',
        data: subcategories,
      };
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw new InternalServerErrorException('Failed to fetch subcategories');
    }
  }

  // ✅ Find One
  async findOne(id: string) {
    try {
      const subcategory = await this.prisma.subCategory.findUnique({
        where: { id },
        include: {
          category: true,
          products: true,
        },
      });

      if (!subcategory) {
        throw new NotFoundException('Subcategory not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Subcategory fetched successfully',
        data: subcategory,
      };
    } catch (error) {
      console.error('Error fetching subcategory:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to fetch subcategory');
    }
  }

  // ✅ Update
  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    try {
      const existing = await this.prisma.subCategory.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Subcategory not found');
      }

      // If categoryId is being updated, check if new category exists
      if (updateSubcategoryDto.categoryId) {
        const category = await this.prisma.category.findUnique({
          where: { id: updateSubcategoryDto.categoryId },
        });

        if (!category) {
          throw new NotFoundException('Parent category not found');
        }
      }

      const updated = await this.prisma.subCategory.update({
        where: { id },
        data: updateSubcategoryDto,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Subcategory updated successfully',
        data: updated,
      };
    } catch (error) {
      console.error('Error updating subcategory:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to update subcategory');
    }
  }

  // ✅ Delete
  async remove(id: string) {
    try {
      const existing = await this.prisma.subCategory.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Subcategory not found');
      }

      await this.prisma.subCategory.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Subcategory deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to delete subcategory');
    }
  }
}
