import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OxService } from '../ox/ox.service';
import { RegisterCompanyDto } from './dto/register-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly oxService: OxService,
  ) {}

  async registerCompany(userId: number, dto: RegisterCompanyDto) {
    const { token, subdomain } = dto;

    await this.oxService.validateToken(token, subdomain);

    const result = await this.prisma.$transaction(async (tx) => {
      let company = await tx.company.findUnique({
        where: { subdomain },
      });

      if (!company) {
        company = await tx.company.create({
          data: {
            subdomain,
            oxToken: token,
            createdById: userId,
          },
        });

        await tx.userCompany.create({
          data: {
            userId,
            companyId: company.id,
            role: 'admin',
          },
        });

        return { company, role: 'admin' as const };
      }

      await tx.company.update({
        where: { id: company.id },
        data: {
          oxToken: token,
        },
      });

      const existingMembership = await tx.userCompany.findUnique({
        where: {
          userId_companyId: {
            userId,
            companyId: company.id,
          },
        },
      });

      if (!existingMembership) {
        await tx.userCompany.create({
          data: {
            userId,
            companyId: company.id,
            role: 'manager',
          },
        });
      }

      return { company, role: existingMembership?.role ?? ('manager' as const) };
    });

    return {
      company: result.company,
      role: result.role,
    };
  }

  async deleteCompany(userId: number, companyId: number) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.createdById !== userId) {
      throw new ForbiddenException('Only creator admin can delete this company');
    }

    const adminMembership = await this.prisma.userCompany.findFirst({
      where: {
        userId,
        companyId,
        role: 'admin',
      },
    });

    if (!adminMembership) {
      throw new ForbiddenException('User is not admin of this company');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.userCompany.deleteMany({
        where: { companyId },
      });
      await tx.company.delete({
        where: { id: companyId },
      });
    });

    return { success: true };
  }
}

