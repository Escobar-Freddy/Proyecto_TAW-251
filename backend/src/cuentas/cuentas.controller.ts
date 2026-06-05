import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query
} from '@nestjs/common';
import { CuentasService } from './cuentas.service';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('cuentas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CuentasController {
  constructor(private readonly cuentasService: CuentasService) {}

  @Post()
  @Roles('admin') // Solo admin puede crear cuentas
  create(@Body() createCuentaDto: CreateCuentaDto) {
    return this.cuentasService.create(createCuentaDto);
  }

  @Get()
  @Roles('admin', 'tesorero', 'usuario')
  findAll() {
    return this.cuentasService.findAll();
  }

  @Get('tree')
  @Roles('admin', 'tesorero', 'usuario')
  getTree() {
    return this.cuentasService.getTree();
  }

  @Get('principales')
  @Roles('admin', 'tesorero', 'usuario')
  findPrincipales() {
    return this.cuentasService.findPrincipales();
  }

  @Get('tipo/:tipo')
  @Roles('admin', 'tesorero', 'usuario')
  findByTipo(@Param('tipo') tipo: string) {
    return this.cuentasService.findByTipo(tipo);
  }

  @Get('codigo/:codigo')
  @Roles('admin', 'tesorero', 'usuario')
  findByCodigo(@Param('codigo') codigo: string) {
    return this.cuentasService.findByCodigo(codigo);
  }

  @Get(':id')
  @Roles('admin', 'tesorero', 'usuario')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasService.findOne(id);
  }

  @Get(':id/hijas')
  @Roles('admin', 'tesorero', 'usuario')
  findHijas(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasService.findHijas(id);
  }

  @Patch(':id')
  @Roles('admin') // Solo admin puede modificar cuentas
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCuentaDto: UpdateCuentaDto,
  ) {
    return this.cuentasService.update(id, updateCuentaDto);
  }

  @Delete(':id')
  @Roles('admin') // Solo admin puede eliminar cuentas
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasService.remove(id);
  }
}