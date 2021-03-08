import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';
import { AdvertsPhotos } from '../adverts-photos/adverts-photos.entity';
import { Address } from '../address/address.entity';

@Entity()
export class Adverts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column( {type:"numeric", nullable: false, precision: 10, scale: 2 })
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

  @OneToMany(() => AdvertsPhotos, (advertsPhotos) => advertsPhotos.adverts, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  advertsPhotos: AdvertsPhotos[];

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  address: Address;

  public static of(params: Partial<Adverts>): Adverts {
    const adverts = new Adverts();

    Object.assign(adverts, params);

    return adverts;
  }
}
