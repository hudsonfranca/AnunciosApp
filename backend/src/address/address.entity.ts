import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 9 })
  zip: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  street: string;

  @Column({ nullable: false, type: 'int' })
  number: number;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  city: string;

  @Column({ nullable: false, type: 'varchar', length: 2 })
  state: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  neighborhood:string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public static of(params: Partial<Address>): Address {
    const address = new Address();

    Object.assign(address, params);

    return address;
  }
}
