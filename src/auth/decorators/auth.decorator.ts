import { UseGuards, applyDecorators } from '@nestjs/common';

import { RolesGuard } from "../guard/roles.guard";
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Role } from '../enums/rol.enum';

export function Auth(role: Role) {
    return applyDecorators(
        Roles(role),
        UseGuards(JwtAuthGuard, RolesGuard),
    )
}