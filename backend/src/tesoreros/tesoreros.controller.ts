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
  HttpStatus
} from '@nestjs/common';
import { TesorerosService } from './tesoreros.service';
import { CreateTesoreroDto } from './dto/create-tesoreros.dto';
import { UpdateTesoreroDto } from './dto/update-tesoreros.dto';

@Controller('tesoreros')
export class TesorerosController {
  constructor(private readonly tesorerosService: TesorerosService) {}

  @Post()
  create(@Body() createTesoreroDto: CreateTesoreroDto) {
    return this.tesorerosService.create(createTesoreroDto);
  }

  @Get()
  findAll() {
    return this.tesorerosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tesorerosService.findOne(id);
  }

  @Get('usuario/:idUsuario')
  findByUsuarioId(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return this.tesorerosService.findByUsuarioId(idUsuario);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTesoreroDto: UpdateTesoreroDto,
  ) {
    return this.tesorerosService.update(id, updateTesoreroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tesorerosService.remove(id);
  }
}