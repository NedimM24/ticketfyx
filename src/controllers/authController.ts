import type { Request, Response } from 'express';
import { registerUser } from '../db/authQueries';

//CREATE CONTROLLERS
export async function addNewUser(req: Request, res: Response){
    const {user_name, password} = req.body;
    await registerUser(user_name, password);
    //res.redirect('/login') //when user registers, send them to login
};

//READ CONTROLLER
export function showForm(_req: Request, res: Response) {
    res.render('registerForm')
};

