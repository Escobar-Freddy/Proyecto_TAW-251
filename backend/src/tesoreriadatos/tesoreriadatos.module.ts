import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TesoreriadatosController } from './tesoreriadatos.controller';
import { TesoreriadatosService } from './tesoreriadatos.service';
import { Movimiento } from '../movimientos/entities/movimiento.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CuentaContable } from '../cuentas/entities/cuenta.entity';
import { AuthModule } from '../auth/auth.module'; //Importar AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Movimiento, Usuario, CuentaContable]),
    AuthModule, //Agregar AuthModule para tener acceso a JwtService
  ],
  controllers: [TesoreriadatosController],
  providers: [TesoreriadatosService],
})
export class TesoreriadatosModule {}