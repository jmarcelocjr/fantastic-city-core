import { Rarity, Size } from './enums';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Building } from './building.entity';
import { Slots } from './interfaces/land.slots.interface';
import { User } from './user.entity';

@Entity()
export class Land {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nft_id: number;

  @Column()
  type: 'free' | 'nft';

  @Column({
    type: 'enum',
    enum: Rarity,
  })
  rarity: Rarity;

  @Column({
    type: 'enum',
    enum: Size,
  })
  size: Size;

  @Column({ type: 'json' })
  slots: Slots;

  @Column({ type: 'json' })
  properties?: object;

  @OneToMany(() => Building, (building) => building.land)
  buildings: Building[];

  @ManyToOne(() => User)
  user: User;
}
