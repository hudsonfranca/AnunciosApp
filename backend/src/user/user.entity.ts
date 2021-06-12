import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Address } from '../address/address.entity';
import { Adverts } from '../adverts/adverts.entity';
import { UserRole } from './user-role';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  first_name: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  last_name: string;

  @Column('text', { nullable: false, array: true, default: '{}' })
  roles: UserRole[];

  @Column({ nullable: false, default: true })
  status: boolean;

  @Column({ nullable: false})
  password: string;

  @Column({ nullable: false, type: 'varchar', length: 15 })
  phone_number: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Address, {
    cascade: true,
    eager: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  address: Address;

  @OneToMany(() => Adverts, (adverts) => adverts.user, { cascade: true })
  adverts: Adverts[];

  public static of(params: Partial<User>): User {
    const user = new User();

    Object.assign(user, params);

    return user;
  }
}
