import { Rarity, Size } from "./enums";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Properties } from "./interfaces/building.properties.interface";
import { Land } from "./land.entity";
import { User } from "./user.entity";

@Entity()
export class Building {
    static readonly MAX_CHARGE       = 3;
    static readonly HOURS_PER_CHARGE = 4;

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    nft_id: number;

    @Column({
        type: 'enum',
        enum: Rarity
    })
    rarity: string;

    @Column({
        type: 'enum',
        enum: Size
    })
    size: string;

    @Column({ type: 'json' })
    properties: Properties;
    
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deleted_at: Date;

    @ManyToOne(type => Land)
    land: Land;

    @ManyToOne(type => User)
    user: User;
}