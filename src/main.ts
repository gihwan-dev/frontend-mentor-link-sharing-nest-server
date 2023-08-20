import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: [
      'https://frontend-mentor-link-sharing-next-front.vercel.app',
      'http://localhost:3000',
      'https://https://frontend-mentor-link-sharing-nest-server.vercel.app',
    ],
  });
  app.use(cookieParser());
  await app.listen(8000);
}

bootstrap();
