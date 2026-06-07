import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar CORS con múltiples orígenes (desarrollo y producción)
  const allowedOrigins = [
    'http://localhost:8080',        // Frontend en Docker local
    'http://localhost:5173',        // Frontend en desarrollo local (Vite)
    'http://localhost:3000',        // Mismo backend
    process.env.FRONTEND_URL,       // Frontend en Render (variable de entorno)
  ].filter(Boolean); // Elimina valores undefined o null
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  console.log('CORS habilitado para orígenes:', allowedOrigins);
  
  // Middleware global para capturar IP y browser
  app.use(new LoggerMiddleware().use);
  
  // Validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Elimina propiedades no definidas en DTO
    forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
    transform: true,           // Convierte automáticamente tipos
  }));
  
  // Escuchar en todas las interfaces de red (importante para Docker y Render)
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📚 Documentación Swagger en http://localhost:${port}/api`);
  
  // Mostrar URL del frontend configurada
  if (process.env.FRONTEND_URL) {
    console.log(`✅ CORS permitido para frontend: ${process.env.FRONTEND_URL}`);
  } else {
    console.log(`⚠️  No se configuró FRONTEND_URL en variables de entorno`);
  }
}

bootstrap();