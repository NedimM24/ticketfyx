
import { RequestHandler } from "express";

export const isAuth: RequestHandler = (req, res, next): void => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.render('loginForm')
    }
};

//If user is an Admin we can move forward
export const isAdmin: RequestHandler = (req, res, next): void => {
    const user = req.user as {role: string};

    if(req.isAuthenticated() && user.role === "admin"){
        next();
    } else {
        res.redirect('/');
    }
};

//If user is an Admin we can move forward
export const isDeveloper: RequestHandler = (req, res, next): void => {
    const user = req.user as {role: string};

    if(req.isAuthenticated() && user.role === "developer"){
        next();
    } else {
        res.redirect('/');
    }
};

