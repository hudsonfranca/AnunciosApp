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

@Controller('category')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.VERIFIED_EMAIL)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(
      createCategoryDto,
    );

    return category;
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.VERIFIED_EMAIL)
  async index(@Query('offset') offset: number, @Query('limit') limit: number) {
    const categories = await this.categoryService.findManyCategories({
      limit,
      offset,
    });
    return categories;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.VERIFIED_EMAIL)
  async show(@Param() { id }: FindOneParams) {
    const categories = await this.categoryService.findOneById(id);
    return categories;
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.VERIFIED_EMAIL)
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
  @Roles(UserRole.ADMIN, UserRole.VERIFIED_EMAIL)
  async delete(@Param() { id }: FindOneParams) {
    const result = await this.categoryService.deleteCategory(id);
    return result;
  }
}
