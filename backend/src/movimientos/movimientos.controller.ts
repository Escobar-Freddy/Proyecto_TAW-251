import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req
} from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { FilterMovimientoDto } from './dto/filter-movimiento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('movimientos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Post()
  @Roles('admin', 'tesorero')
  create(@Body() createMovimientoDto: CreateMovimientoDto, @Req() req: any) {
    const userRol = req.user.rol;
    return this.movimientosService.create(createMovimientoDto, userRol);
  }

  @Get()
  @Roles('admin', 'tesorero', 'usuario')
  findAll(@Query() filterDto: FilterMovimientoDto, @Req() req: any) {
    const userRol = req.user.rol;
    return this.movimientosService.findAll(filterDto, userRol);
  }

  @Get('resumen')
  @Roles('admin', 'tesorero', 'usuario')
  getResumen(
    @Query('fecha_inicio') fecha_inicio: string,
    @Query('fecha_fin') fecha_fin: string,
  ) {
    return this.movimientosService.getResumen(fecha_inicio, fecha_fin);
  }

  @Get('resumen/cuentas')
  @Roles('admin', 'tesorero', 'usuario')
  getResumenPorCuenta(
    @Query('fecha_inicio') fecha_inicio: string,
    @Query('fecha_fin') fecha_fin: string,
  ) {
    return this.movimientosService.getResumenPorCuenta(fecha_inicio, fecha_fin);
  }

  @Get(':id')
  @Roles('admin', 'tesorero', 'usuario')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userRol = req.user.rol;
    return this.movimientosService.findOne(id, userRol);
  }

  @Patch(':id')
  @Roles('admin', 'tesorero')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovimientoDto: UpdateMovimientoDto,
    @Req() req: any,
  ) {
    const userRol = req.user.rol;
    return this.movimientosService.update(id, updateMovimientoDto, userRol);
  }

  @Delete(':id')
  @Roles('admin', 'tesorero')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userRol = req.user.rol;
    await this.movimientosService.softDelete(id, userRol);
  }
}