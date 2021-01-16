import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';

@Entity()
export class Adverts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column({ nullable: false, type: 'decimal', precision: 5, scale: 2 })
  price: number;

  @Column({ nullable: false, type: 'varchar' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Category, (category) => category.adverts, { cascade: true })
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => User, (user) => user.adverts, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  public static of(params: Partial<Adverts>): Adverts {
    const adverts = new Adverts();

    Object.assign(adverts, params);

    return adverts;
  }
}