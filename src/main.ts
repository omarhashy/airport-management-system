import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
// import { ErrorFilter } from './common/errors/error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') ?? 3000;
  // app.useGlobalFilters(new ErrorFilter());
  await app.listen(port);
}
bootstrap();
