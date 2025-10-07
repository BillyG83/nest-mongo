import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostStatus, PostType } from './dtos/createPost.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn({})
  id: any;

  @Column({
    nullable: true,
    type: 'text',
  })
  content: string;

  @Column({
    length: 1024,
    nullable: true,
    type: 'varchar',
  })
  featuredImageUrl: string;

  @OneToOne(() => MetaOption)
  @JoinColumn()
  metaOptions?: MetaOption | null;

  @Column({
    default: PostType.POST,
    enum: PostType,
    nullable: false,
    type: 'enum',
  })
  postType: PostType;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  publishedOn: string;

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

  @Column({
    default: PostStatus.DRAFT,
    enum: PostStatus,
    nullable: false,
    type: 'enum',
  })
  status: PostStatus;

  // @Column({
  //   nullable: true,
  //   type: 'array',
  // })
  // tags: string[];

  @Column({
    length: 128,
    nullable: false,
    type: 'varchar',
  })
  title: string;
}
