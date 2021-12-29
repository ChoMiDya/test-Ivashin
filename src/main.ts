import './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BasicAuthGuard } from './guards/basicAuth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new BasicAuthGuard());
  await app.listen(3000);
}
bootstrap();
