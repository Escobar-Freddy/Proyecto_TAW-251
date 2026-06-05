import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TesorerosService } from './tesoreros.service';
import { TesorerosController } from './tesoreros.controller';
import { Tesorero } from './entities/tesoreros.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tesorero]),
    UsuariosModule, // Para usar el servicio de usuarios
  ],
  controllers: [TesorerosController],
  providers: [TesorerosService],
  exports: [TesorerosService],
})
export class TesorerosModule {}