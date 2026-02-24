import { Body, Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminOnly } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('register-company')
  @UseGuards(JwtAuthGuard)
  async registerCompany(
    @CurrentUser() user: { userId: number },
    @Body() dto: RegisterCompanyDto,
  ) {
    return this.companiesService.registerCompany(user.userId, dto);
  }

  @Delete('company/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  async deleteCompany(
    @CurrentUser() user: { userId: number },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.companiesService.deleteCompany(user.userId, id);
  }
}

