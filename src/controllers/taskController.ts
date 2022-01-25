import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { Task } from '../entity/Task';
import moment from "moment";
class taskController {
    static createTask = async (req: Request, res: Response) => {
        let { name, description, dateComplete } = req.body;
        const createdAt = moment().format("MM/DD/YYYY HH:mm:ss");
        dateComplete = moment(dateComplete, 'DD/MM/YYYY HH:mm').format("MM/DD/YYYY HH:mm:ss");
        const id = res.locals.jwtPayload.userId;
        let task = new Task();
        task.name = name;
        task.description = description;
        task.dateComplete = dateComplete;
        task.createdAt = createdAt;
        task.userId = id;
        console.log(task);
        const taskRepository = getRepository(Task);
        try {
            await taskRepository.save(task);
            res.status(201).json({ task });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error });
        }
    };

    static getTaskById = async (req: Request, res: Response) => {
        const { id } = req.params;

        const userId = res.locals.jwtPayload.userId;
        const taskRepository = getRepository(Task);
        let task;
        try {
            task = await taskRepository.findOne({ where: { userId: userId, id: id } });
            console.log(task);
            if (!task) {
                return res.status(404).json({ message: `Task not found with id: ${id}` });
            } else {
                return res.status(200).json({
                    name: task.name,
                    description: task.description,
                    dateComplete: task.dateComplete,
                    status: task.status
                });
            }
        } catch (error) {
            return res.status(404).json({ message: `Task not found with taskId: ${id} and userId: ${userId}` });
        }

    };


    static updateTask = async (req: Request, res: Response) => {
        const { id } = req.params;

        const userId = res.locals.jwtPayload.userId;
        const taskRepository = getRepository(Task);
        let task;
        task = await taskRepository.findOne({ where: { userId: userId, id: id } });
        console.log(task);
        if (!task) {
            return res.status(404).json({ message: `Task not found with id: ${id}` });
        }
        const completed = moment(task.dateComplete, 'DD/MM/YYYY HH:mm:ss');
        const now = moment();
        if (completed < now) {
            task.status = 'Completed';
            await taskRepository.save(task);
            return res.status(200).json({ message: 'Task is completed' });
        } else {
            const updatedAt = moment().format("MM/DD/YYYY HH:mm:ss");
            if (req.body.name) {
                task.name = req.body.name;
            }
            if (req.body.description) {
                task.description = req.body.description;
            }
            if (req.body.dateComplete) {
                task.dateComplete = moment(req.body.dateComplete, 'DD/MM/YYYY HH:mm:ss').format("MM/DD/YYYY HH:mm:ss");
            }
            task.updatedAt = updatedAt;
            await taskRepository.save(task);
            return res.status(200).json({ task });
        }
    };

    static removeTask = async (req: Request, res: Response) => {
        const { id } = req.params;

        const userId = res.locals.jwtPayload.userId;
        const taskRepository = getRepository(Task);
        let task;
        task = await taskRepository.findOne({ where: { userId: userId, id: id } });
        console.log(task);
        if (!task) {
            return res.status(404).json({ message: `Task not found with id: ${id}` });
        }
        const completed = moment(task.dateComplete, 'DD/MM/YYYY HH:mm:ss');
        const now = moment();
        if (completed < now) {
            task.status = 'Completed';
            await taskRepository.save(task);
            return res.status(200).json({ message: 'Task is completed' });
        } else {
            try {
                await taskRepository.remove(task);
                return res.status(200).json({ message: 'Task is deleted successfully' });
            } catch (error) {
                console.log(error);
                return res.status(400).json({ error });
            }
        }
    };

    static getAllTasks = async (req: Request, res: Response) => {
        const tasks = await getConnection().createQueryBuilder()
            .select(["task.name", "task.description", "task.dateComplete", "task.status"])
            .from(Task, "task").getMany();
        if (tasks.length < 0) {
            return res.status(404).json({ message: "No tasks found" })
        }
        return res.status(200).json(tasks);
    };
    static getAllTaskByUser = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const tasks = await getConnection().createQueryBuilder()
            .select(["task.name", "task.description", "task.dateComplete", "task.status"])
            .from(Task, "task")
            .where("task.userId = :userId", { userId: userId })
            .getMany();
        if (tasks.length === 0) {
            return res.status(404).json({ message: `No tasks found with userId: ${userId}` })
        }
        return res.status(200).json(tasks);
    }
    static assignTask = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userLocal = res.locals.jwtPayload.userId;
        const taskRepository = getRepository(Task);
        let task;
        task = await taskRepository.findOne({ where: { id: id } });
        if (!task) {
            return res.status(404).json({ message: `Task not found with id: ${id}` });
        }
        if (task.userId === userLocal) {
            return res.status(400).json({ message: `Task assigned with user ${userLocal}` });
        } else {
            task.userId = userLocal;
            await taskRepository.save(task);
            return res.status(200).json({
                name: task.name,
                description: task.description,
                dateComplete: task.dateComplete,
                status: task.status
            });
        }
    }
};



export default taskController;
