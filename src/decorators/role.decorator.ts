import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';
import * as dotenv from 'dotenv';
dotenv.config();

export const ROLES_KEY = process.env.ROLES_KEY;
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
