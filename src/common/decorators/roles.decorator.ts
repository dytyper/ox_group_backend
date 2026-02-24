import { SetMetadata } from '@nestjs/common';

export type RoleType = 'admin' | 'manager';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);

export const AdminOnly = () => Roles('admin');
export const ManagerOnly = () => Roles('manager', 'admin');

