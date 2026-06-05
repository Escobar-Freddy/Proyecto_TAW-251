import { 
  Controller, 
  Post, 
  Body, 
  Req, 
  HttpCode, 
  HttpStatus,
  UseGuards,
  Get,
  Headers
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Función auxiliar para obtener IP formateada
  private getFormattedIp(req: any): string {
    // Verificar proxy
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      const ip = forwarded.split(',')[0].trim();
      return ip === '::1' || ip === '::ffff:127.0.0.1' ? '127.0.0.1' : ip;
    }
    
    let ip = req.ip || req.connection?.remoteAddress || 'unknown';
    
    // Formatear IPv6 localhost
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1';
    }
    
    // Eliminar prefijo IPv6
    if (ip?.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }
    
    return ip;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    const ip = this.getFormattedIp(req);
    const browser = req.headers['user-agent'] || 'unknown';
    
    return this.authService.login(loginDto, ip, browser);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Body() logoutDto: LogoutDto, @Req() req: any) {
    const ip = this.getFormattedIp(req);
    const browser = req.headers['user-agent'] || 'unknown';
    
    return this.authService.logout(logoutDto.id_usuario, ip, browser);
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.validateToken(token);
  }
}