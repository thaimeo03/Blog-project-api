import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  url: string

  @Column()
  public_id: string
}
