import express from "express";
import morgan from "morgan";
import 'reflect-metadata';
import { User } from './entity/User';
import { createConnection } from 'typeorm';
import { userRouter } from './routes/user';
import { taskRouter } from "./routes/task";
import { Task } from "./entity/Task";
import config from "./config/config";
const app = express();


const main = async () => {
    try {
        await createConnection({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: config.username,
            password: config.password,
            database: config.database,
            entities: [
                User, Task
            ],
            synchronize: true,
        });
        console.log('Connected to MySql');
        // Call midlewares
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(morgan('dev'));

        app.use('/api/', userRouter);
        app.use('/api/task/', taskRouter);

        const port = config.PORT || 2000;
        app.listen(port, () => console.log(`App listen at http://localhost:${port}`));
    } catch (error) {
        console.error(error);
        throw new Error('Unable to connect to db');
    }
};

main();