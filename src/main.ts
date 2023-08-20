import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: [
      'X-CSRF-Token',
      'X-Requested-With, Accept',
      'Accept-Version',
      'Content-Length',
      'Content-MD5',
      'Content-Type',
      'Date',
      'X-Api-Version',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    origin: [
      'https://frontend-mentor-link-sharing-next-front.vercel.app',
      'http://localhost:3000',
      '*',
    ],
  });
  // app.use(cookieParser());
  await app.listen(8000);
}

bootstrap();
