import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentasService } from './cuentas.service';
import { CuentasController } from './cuentas.controller';
import { CuentaContable } from './entities/cuenta.entity';
import { AuthModule } from '../auth/auth.module'; // ✅ Importar AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([CuentaContable]),
    AuthModule, // ✅ Agregar AuthModule aquí para tener acceso a JwtService y Guards
  ],
  controllers: [CuentasController],
  providers: [CuentasService],
  exports: [CuentasService],
})
export class CuentasModule {}