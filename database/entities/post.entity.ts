import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @Index()
  title: string

  @Column({
    nullable: true
  })
  thumbnail: string

  @Column({
    type: 'longtext',
    nullable: true
  })
  content: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.posts)
  user: User
}
