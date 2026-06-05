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
    const jwtSecret = configService.get<string>('JWT_SECRET');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret || 'temp_secret_for_development_only',
    });
  }

  async validate(payload: any) {
    // ✅ Asegurar que el payload contiene los datos necesarios
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token inválido');
    }

    // Verificar que la sesión esté activa (opcional)
    const sesion = await this.sesionRepository.findOne({
      where: { 
        id_usuario: payload.sub,
        activa: true 
      }
    });

    // ✅ Retornar el objeto que se asignará a req.user
    return { 
      id_usuario: payload.sub, 
      email: payload.email, 
      rol: payload.rol 
    };
  }
}