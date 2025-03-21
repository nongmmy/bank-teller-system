import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer')
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  telephone: string;
}
