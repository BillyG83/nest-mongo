import { Post } from 'src/posts/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
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

  // one to one bidirectional relationship, if post is delete, meta options is too
  @OneToOne(() => Post, (post) => post.metaOptions)
  post: Post;

  @UpdateDateColumn()
  updateDate: Date;
}
