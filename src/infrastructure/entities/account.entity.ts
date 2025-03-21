import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('account')
export class AccountEntity {
  @PrimaryColumn()
  accountId: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => CustomerEntity, { eager: true })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;
}
