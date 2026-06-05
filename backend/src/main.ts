import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Puerto de Vite/React
    credentials: true,
  });
  
  // Middleware global para capturar IP y browser
  app.use(new LoggerMiddleware().use);
  
  // Validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Elimina propiedades no definidas en DTO
    forbidNonWhitelisted: true,  // Lanza error si hay propiedades extra
    transform: true,  // Convierte automáticamente tipos (string a number, etc.)
  }));
  
  await app.listen(3000);
  console.log(`http://localhost:3000`);
}
bootstrap();