import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rol } from './enums/Rol';
import { Activities } from './enums/Activities';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Object.values(Rol),
    default: Rol.USER,
  })
  rol: Rol;

  @Column({
    type: 'enum',
    enum: Object.values(Activities),
    array: true,
    default: [Activities.READER],
  })
  activities: Activities[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
