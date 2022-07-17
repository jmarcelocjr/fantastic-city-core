import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Building } from "./building.entity";
import { Land } from "./land.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    @Index()
    blockchain_address?: string;

    @Column()
    nonce?: number

    @OneToMany(type => Building, building => building.user)
    buildings?: Building[];

    @OneToMany(type => Land, land => land.user)
    lands?: Land[];
}