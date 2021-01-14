import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/user-role';

export const Role = (role: UserRole) => SetMetadata('role', role);
