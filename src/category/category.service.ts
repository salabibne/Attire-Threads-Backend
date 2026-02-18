import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const existing = await this.prisma.category.findUnique({
        where: { name: createCategoryDto.name },
      });
      if (existing) {
        throw new InternalServerErrorException('Category with this name already exists');
      }
      const category = await this.prisma.category.create({
        data: createCategoryDto,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      console.error('Error creating category:', error);
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  // ✅ Find All
  async findAll() {
    try {
      const categories = await this.prisma.category.findMany({
        include: { subcategories: true },
        orderBy: { createdAt: 'desc' },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Categories fetched successfully',
        data: categories,
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }

  // ✅ Find One
  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: { subcategories: true },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Category fetched successfully',
        data: category,
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to fetch category');
    }
  }

  // ✅ Update
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const existing = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Category not found');
      }

      const updated = await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Category updated successfully',
        data: updated,
      };
    } catch (error) {
      console.error('Error updating category:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to update category');
    }
  }

  // ✅ Delete
  async remove(id: string) {
    try {
      const existing = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Category not found');
      }

      await this.prisma.category.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Category deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Failed to delete category');
    }
  }
}
