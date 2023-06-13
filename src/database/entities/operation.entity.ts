import { OperationType } from '../../common/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'operations' })
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: OperationType;

  @Column()
  cost: number;
}
