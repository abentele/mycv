import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieSession from 'cookie-session';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // don't configure the app here as this configuration would not be used for e2e tests!
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
