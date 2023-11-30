import { Role } from 'common/enums/users.enum'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm'
import { Post } from './post.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  role: Role

  @Column()
  @Index({
    unique: true
  })
  email: string

  @Column()
  password: string

  @Column({
    nullable: true
  })
  avatar: string

  @Column({
    nullable: true
  })
  address: string

  @Column({
    nullable: true
  })
  birthday: Date

  @Column({
    nullable: true
  })
  refreshToken: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]
}
