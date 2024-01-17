import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: [
      // 'https://frontend-mentor-link-sharing-next-front.vercel.app',
      'http://localhost:3000',
    ],
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 8080);
}

bootstrap();
