import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TesoreriadatosService } from './tesoreriadatos.service';

@Controller('')
export class TesoreriadatosController {
  constructor(private readonly tesoreriadatosService: TesoreriadatosService) {}

  // Endpoint público para obtener datos de tesorería (movimientos)
  @Get('tesoreriadatos')
  async obtenerDatosPublicos() {
    return this.tesoreriadatosService.obtenerTodosLosMovimientos();
  }

  // Endpoint de login para aplicación móvil
  @Post('login-mobile')
  @HttpCode(HttpStatus.OK)
  async loginMobile(@Body() body: { email: string; password: string }) {
    return this.tesoreriadatosService.loginMobile(body.email, body.password);
  }
}