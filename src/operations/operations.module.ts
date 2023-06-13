import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from '../database/entities/operation.entity';
import { RecordsModule } from '../records/records.module';
import { UsersModule } from '../users/users.module';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Operation]), RecordsModule, UsersModule],
  providers: [OperationsService],
  controllers: [OperationsController]
})
export class OperationsModule { }
