import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para múltiples orígenes (desarrollo y Docker)
  app.enableCors({
    origin: [
      'http://localhost:8080',    // Frontend en Docker
      'http://localhost:5173',    // Frontend en desarrollo local (Vite)
      'http://localhost:3000',    // Mismo backend
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Middleware global para capturar IP y browser
  app.use(new LoggerMiddleware().use);
  
  // Validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Elimina propiedades no definidas en DTO
    forbidNonWhitelisted: true,  // Lanza error si hay propiedades extra
    transform: true,  // Convierte automáticamente tipos (string a number, etc.)
  }));
  
  // Escuchar en todas las interfaces de red (importante para Docker)
  await app.listen(3000, '0.0.0.0');
  console.log(`Servidor corriendo en http://localhost:3000`);
  console.log(`Frontend en http://localhost:8080`);
}

bootstrap();