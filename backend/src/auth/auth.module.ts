import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AccessLogsModule } from '../access_logs/access_logs.module';
import { SesionActiva } from './entities/sesion.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'miClaveSecretaPorDefecto123',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '1d', // ✅ Valor por defecto '1d'
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([SesionActiva]),
    UsuariosModule,
    AccessLogsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [JwtStrategy, PassportModule, JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}