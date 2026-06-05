import { 
  Controller, 
  Get, 
  Param, 
  Query, 
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccessLogsService } from './access_logs.service';
import { FilterAccessLogDto } from './dto/filter-access-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('access-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AccessLogsController {
  constructor(private readonly accessLogsService: AccessLogsService) {}

  @Get()
  async findAll(@Query() filterDto: FilterAccessLogDto, @Req() req: any) {
    // ✅ Obtener el rol del usuario desde req.user
    const userRol = req.user?.rol;
    // ✅ Enviar ambos argumentos: filterDto y userRol
    return this.accessLogsService.findAll(filterDto, userRol);
  }

  @Get('estadisticas')
  async getEstadisticas(@Req() req: any) {
    // ✅ Obtener el rol del usuario desde req.user
    const userRol = req.user?.rol;
    // ✅ Enviar el argumento userRol
    return this.accessLogsService.getEstadisticas(userRol);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    // ✅ Obtener el rol del usuario desde req.user
    const userRol = req.user?.rol;
    // ✅ Enviar ambos argumentos: id y userRol
    return this.accessLogsService.findOne(id, userRol);
  }

  @Get('usuario/:idUsuario')
  async findByUsuarioId(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Req() req: any,
  ) {
    // ✅ Obtener el rol del usuario desde req.user
    const userRol = req.user?.rol;
    // ✅ Enviar ambos argumentos: idUsuario y userRol
    return this.accessLogsService.findByUsuarioId(idUsuario, userRol);
  }
}