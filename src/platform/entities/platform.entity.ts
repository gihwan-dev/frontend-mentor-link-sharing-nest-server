import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from '../../user/entities/user.entity';

@Entity()
export class Platforms {
  @PrimaryColumn({
    type: 'text',
    name: 'platform_id',
  })
  id: string;

  @Column({
    nullable: false,
    default: '',
  })
  title: string;

  @Column({
    nullable: false,
    default: '',
  })
  link: string;

  @ManyToOne(() => Users, (users) => users.platforms, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner' })
  owner: Users;
}
