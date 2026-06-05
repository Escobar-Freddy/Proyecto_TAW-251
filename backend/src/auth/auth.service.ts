import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { AccessLogsService } from '../access_logs/access_logs.service';
import { SesionActiva } from './entities/sesion.entity';
import { LoginDto } from './dto/login.dto';

// Simulación de verificación CAPTCHA (reemplazar con Google reCAPTCHA real)
async function verifyCaptcha(token: string): Promise<boolean> {
    // ✅ Solución: Verificar explícitamente que token existe y es string
    if (!token || typeof token !== 'string') {
        return false;
    }
    // TODO: Implementar verificación real con Google reCAPTCHA
    // Por ahora, aceptamos cualquier token no vacío
    return token.length > 0;
}

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private accessLogsService: AccessLogsService,
    @InjectRepository(SesionActiva)
    private sesionRepository: Repository<SesionActiva>,
  ) {}

  async login(loginDto: LoginDto, ip: string, browser: string) {
    // 1. Verificar CAPTCHA
    const isCaptchaValid = await verifyCaptcha(loginDto.captchaToken);
    if (!isCaptchaValid) {
      throw new UnauthorizedException('CAPTCHA inválido');
    }

    // 2. Buscar usuario por email
    const usuario = await this.usuariosService.findByEmail(loginDto.email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Verificar si está activo (no eliminado lógicamente)
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    // 4. Validar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, usuario.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 5. Cerrar sesiones activas anteriores (opcional)
    await this.sesionRepository.update(
      { id_usuario: usuario.id_usuario, activa: true },
      { activa: false, fecha_fin: new Date() }
    );

    // 6. Generar token JWT
    const payload = { 
      sub: usuario.id_usuario, 
      email: usuario.email, 
      rol: usuario.rol 
    };
    const token = this.jwtService.sign(payload);

    // 7. Registrar sesión activa
    const nuevaSesion = this.sesionRepository.create({
      id_usuario: usuario.id_usuario,
      token,
      ip,
      browser,
      fecha_inicio: new Date(),
      activa: true,
    });
    await this.sesionRepository.save(nuevaSesion);

    // 8. Registrar log de ingreso
    await this.accessLogsService.create({
      id_usuario: usuario.id_usuario,
      ip,
      evento: 'ingreso',
      browser,
    });

    // 9. Retornar token y datos del usuario
    return {
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: usuario.id_usuario,
        nombre: `${usuario.nombre} ${usuario.apellido_paterno}`,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async logout(id_usuario: number, ip: string, browser: string) {
    // 1. Cerrar sesión activa
    const sesion = await this.sesionRepository.findOne({
      where: { id_usuario, activa: true },
    });

    if (sesion) {
      sesion.activa = false;
      sesion.fecha_fin = new Date();
      await this.sesionRepository.save(sesion);
    }

    // 2. Registrar log de salida
    await this.accessLogsService.create({
      id_usuario,
      ip,
      evento: 'salida',
      browser,
    });

    return {
      success: true,
      message: 'Logout exitoso',
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const sesion = await this.sesionRepository.findOne({
        where: { token, activa: true },
      });
      
      if (!sesion) {
        throw new UnauthorizedException('Token inválido o expirado');
      }
      
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}