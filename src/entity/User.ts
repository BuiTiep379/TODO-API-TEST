import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import bcrypt from "bcryptjs";
import { Task } from '../entity/Task';
@Entity({ name: "user" })
export class User {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column("varchar")
    name: string;

    @Column("varchar")
    email: string;

    @Column()
    password: string;

    @OneToMany((type) => Task, (task) => task.user, { eager: true })
    tasks: Task[];

    @Column()
    createdAt: Date;


    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}