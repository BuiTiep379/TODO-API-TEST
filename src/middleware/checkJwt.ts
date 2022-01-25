import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {

    //Try to validate the token and get data
    try {
        //Get the jwt token from the head
        const tokenCookie = <string>req.headers.cookie;
        const token = <string>tokenCookie.split('=')[1];
        let jwtPayload;
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;

        //The token is valid for 1 hour
        //We want to send a new token on every request
        const { userId, email, role } = jwtPayload;
        const newToken = jwt.sign({ userId, email, role }, config.jwtSecret, {
            expiresIn: "1h"
        });
        res.setHeader("token", newToken);

        //Call the next middleware or controller
        next();
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).json({
            message: 'require signin'
        });
        return;
    }
};
