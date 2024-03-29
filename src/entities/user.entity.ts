import { Wallet } from 'src/dto/immu-wallet.dto';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Building } from './building.entity';
import { Land } from './land.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Index()
  blockchain_address?: string;

  @Column()
  nonce?: number;

  @OneToMany(() => Building, (building) => building.user)
  buildings?: Building[];

  @OneToMany(() => Land, (land) => land.user)
  lands?: Land[];

  wallets?: Wallet[]
}
