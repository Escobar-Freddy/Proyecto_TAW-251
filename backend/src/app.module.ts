import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { TesorerosModule } from './tesoreros/tesoreros.module';
import { AccessLogsModule } from './access_logs/access_logs.module';
import { AuthModule } from './auth/auth.module';
import { CuentasModule } from './cuentas/cuentas.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import { TesoreriadatosModule } from './tesoreriadatos/tesoreriadatos.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // archivo donde estan las variables o datos
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], //busca automaitcamente cualquier carpeta entities
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UsuariosModule,
    TesorerosModule,
    AccessLogsModule,
    AuthModule,
    CuentasModule,
    MovimientosModule,
    TesoreriadatosModule,
  ],
})
export class AppModule {}