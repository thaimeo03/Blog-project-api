import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  @Index({ unique: true })
  url: string

  @Column()
  public_id: string
}
