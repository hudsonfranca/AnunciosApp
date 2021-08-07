import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  AfterLoad,
} from 'typeorm';
import { Adverts } from '../adverts/adverts.entity';

@Entity()
export class AdvertsPhotos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  originalname: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  filename: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  url: string;

  @AfterLoad()
  addHostUrl(){
    this.url = `${process.env.BACKEND_URL}${this.url}`;
  }


  @ManyToOne(() => Adverts, (adverts) => adverts.advertsPhotos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  adverts: Adverts;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public static of(params: Partial<AdvertsPhotos>): AdvertsPhotos {
    const advertsPhotos = new AdvertsPhotos();

    Object.assign(advertsPhotos, params);

    return advertsPhotos;
  }
}
