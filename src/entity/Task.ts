import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from '../entity/User';
@Entity({ name: "task" })
export class Task {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("varchar")
    name: string;

    @Column("varchar")
    description: string;

    @Column()
    userId: number;

    @Column()
    dateComplete: string;

    @Column({
        type: 'enum',
        enum: ['new', 'complete'],
        default: 'new'
    })
    status: string;

    @ManyToOne((type) => User, (user) => user.tasks, { eager: false })
    user: User;

    @Column()
    createdAt: string;

    @Column({ nullable: true })
    updatedAt: string;

}