import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // Use express.json and express.urlencoded to set body size limit
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));

  // Enable CORS for frontend communication
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
