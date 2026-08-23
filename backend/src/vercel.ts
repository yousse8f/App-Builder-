import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const expressApp = express();
let isInitialized = false;

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

const isAllowedOrigin = (origin?: string) => {
  if (!origin) {
    return true;
  }

  return (
    allowedOrigins.includes(origin) ||
    /^(https?:\/\/.*\.vercel\.app)(?::\d+)?$/i.test(origin) ||
    /^(https?:\/\/localhost)(?::\d+)?$/i.test(origin) ||
    /^(https?:\/\/127\.0\.0\.1)(?::\d+)?$/i.test(origin)
  );
};

async function bootstrap() {
  if (isInitialized) {
    return;
  }

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.enableCors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('App Builder API')
    .setDescription('API documentation for App Builder application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  isInitialized = true;
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  return expressApp(req, res);
}
