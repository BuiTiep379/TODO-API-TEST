import express from 'express';
const router = express.Router();
import taskController from "../controllers/taskController";
import { checkJwt } from "../middleware/checkJwt";

router.post('/create', checkJwt, taskController.createTask);
router.patch('/update/:id', checkJwt, taskController.updateTask);
router.delete('/remove/:id', checkJwt, taskController.removeTask);
router.get('/get/:id', checkJwt, taskController.getTaskById);
router.get('/get-all/', checkJwt, taskController.getAllTasks);
router.get('/get-all/:userId', checkJwt, taskController.getAllTaskByUser);
router.post('/assign/:id', checkJwt, taskController.assignTask);

export { router as taskRouter };