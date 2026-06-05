import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessLogsService } from './access_logs.service';
import { AccessLogsController } from './access_logs.controller';
import { AccessLog } from './entities/access_logs.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessLog]),
    UsuariosModule, // Para verificar usuarios
  ],
  controllers: [AccessLogsController],
  providers: [AccessLogsService],
  exports: [AccessLogsService],
})
export class AccessLogsModule {}