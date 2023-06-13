import { NestFactory, Reflector } from '@nestjs/core';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthGuard } from './common/guards/auth.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());
  app.use(LoggerMiddleware());
  app.enableCors()
  app.useGlobalGuards(new AuthGuard(new Reflector()))
  await app
    .setGlobalPrefix('api/v1')
    .listen(3000);
}
bootstrap();
