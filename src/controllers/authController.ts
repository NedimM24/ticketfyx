import type { Request, Response } from 'express';
import { registerUser } from '../db/authQueries';
import { body, validationResult, Meta } from 'express-validator';


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
        .custom((value: string, { req } : Meta) => {
            if(value !== req.body.password){
                throw new Error('Passwords do not match.')
            }
            return true;
        })
]

export const addNewUser = [
    ...validateUser,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render('registerForm', {
                title: "Register User",
                errors: errors.array(), 
            });
        }
    const {email, password} = req.body;
    try {
        await registerUser(email, password);
        //res.redirect('/login') //when user registers, send them to login
    } catch (error) {
        return res.status(400).render('registerForm', {
            title: 'Register User',
            errors: [{msg: 'Email already in use'}]
        })
    }
    }
];

//READ CONTROLLER
export function showForm(_req: Request, res: Response) {
    res.render('registerForm', {title : 'Register User'})
};

