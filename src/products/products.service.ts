import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OxService } from '../ox/ox.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly oxService: OxService,
  ) {}

  async getProductsForUser(
    userId: number,
    companyId: number,
    page: number,
    size: number,
  ) {
    const membership = await this.prisma.userCompany.findFirst({
      where: {
        userId,
        companyId,
      },
      include: {
        company: true,
      },
    });

    if (!membership) {
      throw new Error('User is not attached to this company');
    }

    const company = membership.company;

    const data = await this.oxService.getVariations(
      company.subdomain,
      company.oxToken,
      page,
      size,
    );

    return data;
  }
}

