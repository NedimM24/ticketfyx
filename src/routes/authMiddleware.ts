
import { RequestHandler } from "express";

export const isAuth: RequestHandler = (req, res, next): void => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.render('loginForm')
    }
};

