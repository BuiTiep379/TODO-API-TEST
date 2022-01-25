import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { Task } from "../entity/Task";
import config from "../config/config";
class userController {
    // 
    static signup = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { name, password, email } = req.body;
        const user = await getConnection().createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.email = :email", { email: email }).getOne();
        if (user) {
            res.status(400).json({
                message: 'Email already exits'
            })
        } else {
            const createdAt = new Date(Date.now());
            let newUser = new User();
            newUser.name = name;
            newUser.password = password;
            newUser.email = email;
            newUser.createdAt = createdAt;
            newUser.hashPassword();
            const userRepository = getRepository(User);
            await userRepository.save(newUser);
            res.status(201).json({ newUser });
        }
    }
    static signin = async (req: Request, res: Response) => {

        const { email, password } = req.body;
        //Get user from database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { email } });
        } catch (error) {
            return res.status(401).json({
                message: "Email not register"
            })
        }

        //Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send();
            return;
        }

        //Sing JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            config.jwtSecret,
            { expiresIn: "1h" }
        );
        //Send the jwt in the response
        res.cookie("token", token, { maxAge: 1000 * 60 * 10 });
        return res.status(200).json({ token });
    };

    static getAllUsers = async (req: Request, res: Response) => {
        //Get users from database
        const users = await getConnection().createQueryBuilder()
            .select(["user.name", "user.email"])
            .from(User, "user").getMany();
        //Send the users object
        res.status(200).json({ users });
    };

};

export default userController;
