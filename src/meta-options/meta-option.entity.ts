import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MetaOption {
  @CreateDateColumn()
  createDate: Date;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'json',
  })
  metaValue: string;

  @UpdateDateColumn()
  updateDate: Date;
}
