import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3000', // L'adresse de ton frontend Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Autorise l'envoi de cookies ou headers d'auth
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  
  await app.listen(3001);
}
bootstrap();
