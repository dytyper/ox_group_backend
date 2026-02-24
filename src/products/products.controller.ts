import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsDto } from './dto/get-products.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ManagerOnly } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ManagerOnly()
  async list(
    @CurrentUser() user: { userId: number },
    @Query() query: GetProductsDto,
  ) {
    const { page, size, companyId } = query;
    return this.productsService.getProductsForUser(
      user.userId,
      companyId,
      page,
      size,
    );
  }
}

