import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // hashed

  @Column({ default: 'USER' })
  role: 'ADMIN' | 'USER';
}
