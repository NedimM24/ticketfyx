import type { Request, Response } from 'express';
import { registerUser, setRoleToDev } from '../db/authQueries';
import { body, validationResult, Meta } from 'express-validator';
import bcrypt from 'bcryptjs';

// Need to tell TS about the user
type AuthenticatedUser = {
    id: number;
    email: string;
    password: string;
    role: string;
    account_creation_date: Date;
}


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
        res.redirect('/login') //when user registers, send them to login
    } catch (error) {
        return res.status(400).render('registerForm', {
            title: 'Register User',
            errors: [{msg: 'Email already in use'}]
        })
    }
    }
];

// VALIDATION AND CONTROLLER FOR THE DEV CODE
const codeLowerCase = "Must be lowercase";
const codeLength = "Must be 6 characters long";

const validateDevCode = [
    body('devcode').trim()
    .isLowercase().withMessage(codeLowerCase)
    .isLength({min: 6, max: 6}).withMessage(codeLength)
]

//Validate the developer code before running the controller
export const setRoleToDeveloper = [
    ...validateDevCode,
     async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render('devRegisterForm', {
                errors: errors.array(), 
            });
        }
        //Get the user submitted dev dcode form the form
        const {devcode}  = req.body;
        const user = req.user as AuthenticatedUser;
        const userId = user.id;
        try {
            //check if they entered dev 123
            if(devcode === "dev123"){
                await setRoleToDev(userId);
                res.redirect('/');
            } else {
                return res.status(400).render('devRegisterForm', {
                    errors:[{msg: "Incorrect dev code. Please try again. HINT(dev123)"}]
                })
            }
        } catch (error) {
            return res.status(500).render('devRegisterForm', {
                errors: [{msg: "Oops, something went wrong. Please try again."}]
            })
        }
    }
]
//READ CONTROLLER

//Displays the registation form
export function showForm(_req: Request, res: Response) {
    res.render('registerForm', {title : 'Register User'})
};

//Displays the login form
export function showLoginForm(req: Request, res: Response) {
    const messages = req.flash('error');
    res.render('loginForm', {
        errors: messages.map(msg => ({msg}))
    })
};

//Displays the dev register form
export function showDevRegisterForm(_req: Request, res: Response) {
    res.render('devRegisterForm')
};

