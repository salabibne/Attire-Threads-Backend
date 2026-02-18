import { Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto.js';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto.js';

@Injectable()
export class SubcategoryService {
  create(createSubcategoryDto: CreateSubcategoryDto) {
    return 'This action adds a new subcategory';
  }

  findAll() {
    return `This action returns all subcategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subcategory`;
  }

  update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    return `This action updates a #${id} subcategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subcategory`;
  }
}
