import type { Request, Response } from 'express';
import { registerUser } from '../db/authQueries';
import { body, validationResult, Meta } from 'express-validator';
const bcrypt = require("bcryptjs");


//CREATE CONTROLLERS

//New User Validation
const emailLengthErr = 'Email must be between 3 and 254 characters long.';
const validEmailErr = "Please enter a valid email address";

const passwordLengthErr = 'Password must be between 3 and 128 characters long.';

//Validating email and passwords
const validateUser = [
    body('email').trim()
        .isLength({min: 3, max: 254}).withMessage(emailLengthErr)
        .isEmail().withMessage(validEmailErr),
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

//If validdation passes, hash the password, store the email and password in db
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
        //Convert user entered pw into a hashed pw with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        await registerUser(email, hashedPassword);
        res.redirect('/');
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

//Displays the registation form
export function showForm(_req: Request, res: Response) {
    res.render('registerForm', {title : 'Register User'})
};

//Displays the login form
export function showLoginForm(_req: Request, res: Response) {
    res.render('loginForm')
};
