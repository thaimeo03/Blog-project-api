import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  BANNED = 'BANNED'
}

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
  email: string

  @Column()
  password: string

  @Column({
    nullable: true
  })
  address: string

  @Column({
    nullable: true
  })
  birthday: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
