import { Body, Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  // @HastRoles(JwtRole.ADMIN)
  // @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Post()
  create(@Body() rol: CreateRolDto) {
    return this.rolesService.create(rol);
  }
}
