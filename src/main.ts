import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // don't configure the app here as this configuration would not be used for e2e tests!
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
