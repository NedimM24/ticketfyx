import type { Request, Response } from 'express';
import { registerUser } from '../db/authQueries';
const { body, validationResult } = require("express-validator");

//CREATE CONTROLLERS

//New User Validation
const emailLengthErr = 'Email must be between 3 and 254 characters long.';
const atErr = "Email must contain @";

const passwordLengthErr = 'Password must be between 3 and 128 characters long.';

const validateUser = [
    body('email').trim()
        .isLength({min: 3, max: 254}).withMessage(emailLengthErr)
        .isEmail().withMessage(atErr),
    body('password').trim()
        .isLength({min: 8, max: 128}).withMessage(passwordLengthErr),
    body('confirmPassword').trim()
        .custom((value: string, { req } : {req: Request}) => {
            if(value !== req.body.password){
                throw new Error('Passwords do not match.')
            }
            return true;
        })
]

export async function addNewUser(req: Request, res: Response){
    const {user_name, password} = req.body;
    await registerUser(user_name, password);
    //res.redirect('/login') //when user registers, send them to login
};

//READ CONTROLLER
export function showForm(_req: Request, res: Response) {
    res.render('registerForm')
};

