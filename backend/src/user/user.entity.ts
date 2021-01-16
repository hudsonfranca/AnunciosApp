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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @Column({ nullable: false, default: true })
  status: boolean;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  confirmationToken: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  recoverToken: string;

  @Column({ nullable: false, type: 'varchar', length: 9 })
  phoneNumber: string;

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
