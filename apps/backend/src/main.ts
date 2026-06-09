import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://apexcampus.vercel.app'],
    credentials: true,
  });

  await app.listen(4000);
  console.log('ApexCampus API running on http://localhost:4000');
}
bootstrap();
