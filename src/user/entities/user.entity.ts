import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Platforms } from '../../platform/entities/platform.entity';

@Entity()
export class Users {
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
  contactEmail: string;

  @OneToMany((type) => Platforms, (platforms) => platforms.owner)
  platforms: Platforms[];
}
