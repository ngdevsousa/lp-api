import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from '../database/entities/record.entity';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [RecordsService]
})
export class RecordsModule { }
