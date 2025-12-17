import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 프록시
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
