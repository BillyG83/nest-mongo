import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 96,
    nullable: false,
    type: 'varchar',
  })
  firstName: string;

  @Column({
    length: 96,
    nullable: true,
    type: 'varchar',
  })
  secondName: string;

  @Column({
    length: 96,
    nullable: false,
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    length: 96,
    nullable: false,
    type: 'varchar',
  })
  password: string;
}
