import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatus } from '../../common/types';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  status: UserStatus
  
  @Column()
  balance: number
}
