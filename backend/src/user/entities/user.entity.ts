import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;
    
    @Column()
    password!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ type: 'varchar', nullable: true })
    refreshToken!: string | null;

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password,10)
    }
}