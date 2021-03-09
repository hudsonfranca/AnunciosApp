import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Request,
  Body,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindOneParams } from './dto/find-one.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserRole } from '../user/user-role';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FindCategoryQueryDto } from './dto/find-category-query.dto';

@Controller('category')

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(
      createCategoryDto,
    );

    return category;
  }

  @Get()
  async index(@Query() query: FindCategoryQueryDto) {
    const categories = await this.categoryService.findManyCategories(query);
    return categories;
  }

  @Get(':id')
  async show(@Param() { id }: FindOneParams) {
    const categories = await this.categoryService.findOneById(id);
    return categories;
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param() { id }: FindOneParams,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const updatedCategory = await this.categoryService.updateCategory({
      id,
      updateCategoryDto,
    });
    return updatedCategory;
  }

  @Delete(':id')
  async delete(@Param() { id }: FindOneParams) {
    const result = await this.categoryService.deleteCategory(id);
    return result;
  }
}
