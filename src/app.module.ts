import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { HealthModule } from './health/health.module';
import { OperationsController } from './operations/operations.controller';
import { OperationsModule } from './operations/operations.module';
import { RecordsController } from './records/records.controller';
import { RecordsModule } from './records/records.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { init_config } from './common/utils/env';

init_config()

@Module({
  imports: [
    HealthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'],
      port: parseInt(process.env['DB_PORT']),
      username: process.env['DB_USER'],
      password: process.env['DB_PASS'],
      database: process.env['DB_NAME'],
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,
    RecordsModule,
    OperationsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: "/auth", method: RequestMethod.POST })
      .forRoutes(UsersController,RecordsController, OperationsController)
  }
}
