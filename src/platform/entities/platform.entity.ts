import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Platform {
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

  @ManyToOne(() => User, (user) => user.platforms, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner' })
  owner: User;
}
