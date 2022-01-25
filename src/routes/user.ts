import express from 'express';
const router = express.Router();
import userController from "../controllers/UserController";
import { checkJwt } from "../middleware/checkJwt";
router.post('/signup', userController.signup);

router.post('/signin', userController.signin)

router.get('/get-all-user', checkJwt, userController.getAllUsers);

export { router as userRouter };