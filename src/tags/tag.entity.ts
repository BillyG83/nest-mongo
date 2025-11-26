import { Post } from 'src/posts/post.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tag {
  @CreateDateColumn()
  createDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({
    nullable: true,
    type: 'text',
  })
  description?: string;

  @Column({
    length: 1024,
    nullable: true,
    type: 'varchar',
  })
  featuredImageUrl?: string;

  @PrimaryGeneratedColumn()
  id: any;

  // cascade ensures where tag is delete the ID to ID relationship
  // is removed from the table post_tags_tag
  @ManyToMany(() => Post, (post) => post.tags, {
    onDelete: 'CASCADE',
  })
  posts: Post[];

  @Column({
    length: 256,
    nullable: false,
    type: 'varchar',
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  schema: string;

  @Column({
    length: 256,
    nullable: false,
    type: 'varchar',
    unique: true,
  })
  slug: string;

  @UpdateDateColumn()
  updateDate: Date;
}
