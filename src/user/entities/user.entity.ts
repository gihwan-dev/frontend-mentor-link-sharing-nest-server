import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Platform } from '../../platform/entities/platform.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    nullable: true,
    default: null,
  })
  username: string;

  @Column({
    nullable: false,
    default: '',
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @Column({
    nullable: true,
    default: null,
  })
  imageURL: string;

  @Column({
    nullable: true,
    default: null,
  })
  contactEmail: string;

  @OneToMany((type) => Platform, (platform) => platform.owner)
  platforms: Platform[];
}
