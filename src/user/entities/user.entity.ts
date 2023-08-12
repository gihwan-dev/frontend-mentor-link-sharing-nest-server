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
    nullable: false,
    default: '',
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

  @OneToMany((type) => Platform, (platform) => platform.owner)
  platforms: Platform[];
}
