import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Operation } from './operation.entity';

@Entity({ name: 'records' })
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  operation_id: number;

  @Column()
  user_id: number;

  @Column()
  amount: number;

  @Column()
  user_balance: number;

  @Column()
  operation_response: string;
  
  @Column()
  is_deleted: boolean;

  @Column()
  date: Date;

  @OneToOne(() => Operation)
  @JoinColumn({ name: 'operation_id' })
  operation: Operation
}
