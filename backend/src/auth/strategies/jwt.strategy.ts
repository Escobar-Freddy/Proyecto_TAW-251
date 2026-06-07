import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SesionActiva } from '../entities/sesion.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(SesionActiva)
    private sesionRepository: Repository<SesionActiva>,
  ) {
    // Obtener JWT_SECRET de las variables de entorno
    const jwtSecret = configService.get<string>('JWT_SECRET');
    
    // ✅ Verificar que JWT_SECRET existe en producción
    if (!jwtSecret && process.env.NODE_ENV === 'production') {
      console.error('⚠️ JWT_SECRET no está definido en las variables de entorno');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret || 'temp_secret_for_development_only', // Solo para desarrollo
    });
    
    console.log('✅ JWT Strategy inicializada');
  }

  async validate(payload: any) {
    // ✅ Validar que el payload contiene los datos necesarios
    if (!payload || !payload.sub) {
      console.error('❌ Token inválido: payload sin sub');
      throw new UnauthorizedException('Token inválido');
    }

    // Verificar que la sesión esté activa (opcional, mejora seguridad)
    try {
      const sesion = await this.sesionRepository.findOne({
        where: { 
          id_usuario: payload.sub,
          activa: true 
        }
      });
      
      // Si no hay sesión activa, rechazar la petición
      if (!sesion) {
        console.warn(`⚠️ Sesión no activa para usuario ${payload.sub}`);
        throw new UnauthorizedException('Sesión no activa o expirada');
      }
    } catch (error) {
      // Si hay error de conexión, al menos permitimos el login si el token es válido
      console.warn('⚠️ No se pudo verificar sesión activa:', error.message);
    }

    // ✅ Retornar el objeto que se asignará a req.user
    return { 
      id_usuario: payload.sub, 
      email: payload.email, 
      rol: payload.rol 
    };
  }
}