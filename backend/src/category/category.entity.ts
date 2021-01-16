import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Adverts } from '../adverts/adverts.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200, unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Adverts, (adverts) => adverts.categories, {})
  adverts: Adverts[];

  public static of(params: Partial<Category>): Category {
    const category = new Category();

    Object.assign(category, params);

    return category;
  }
}
