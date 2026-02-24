import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { ROLES_KEY, RoleType } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles =
      this.reflector.get<RoleType[]>(ROLES_KEY, context.getHandler()) || [];

    if (!requiredRoles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { userId: number } | undefined;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    const userId = user.userId;

    const companyId =
      Number(request.params.companyId) ||
      Number(request.params.id) ||
      Number(request.query.companyId);

    if (!companyId) {
      throw new ForbiddenException('Company context is required');
    }

    const membership = await this.prisma.userCompany.findFirst({
      where: {
        userId,
        companyId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('User is not attached to this company');
    }

    if (!requiredRoles.includes(membership.role as RoleType)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}

