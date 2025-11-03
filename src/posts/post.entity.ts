import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostStatus, PostType } from './dtos/createPost.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn({})
  id: any;

  // bidirectional many to one relationship with user
  @ManyToOne(() => User, (user) => user.posts)
  author: User;

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

  // one to one bidirectional relationship, if post is delete, meta options is too
  @OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
    eager: true, // always return meta-options with posts
    cascade: true, // always creates new meta-options when post is created
  })
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

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @Column({
    length: 128,
    nullable: false,
    type: 'varchar',
  })
  title: string;
}
