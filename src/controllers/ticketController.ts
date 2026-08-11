import type { Request, Response } from 'express';
import { body, validationResult, Meta } from 'express-validator';
import { newTicket, 
            getAllTickets, 
            getTicketById,
        } from '../db/ticketQueries';

import { printCommentsByTicketId

 } from '../db/commentQueries';


// Need to tell TS about the user
type AuthenticatedUser = {
    id: number;
    email: string;
    password: string;
    role: string;
    account_creation_date: Date;
}

const titleLengthError = 'Title must be between 3 and 30 chars';
const issueLengthError = 'Issue must be between 10 and 300 chars';
const priorityError = 'Invalid priority'

//BASIC VALIDATION FOR TICKET FORM. LENGTH AND PRIORITY RADIO BUTTONS
const validateTicket = [
    body('title').trim()
        .isLength({min: 3, max: 30}).withMessage(titleLengthError),
    body('description').trim()
        .isLength({min: 10, max: 300}).withMessage(issueLengthError),
    body('priority')
        .isIn(['low', 'medium', 'high', 'critical']).withMessage(priorityError)
]

//GRABS USER INFO FROM THE FORM ALONG WITH THE CREATOR ID TO USE AS ARGUEMENTS
//IF THE NEW TICKET QUERY PASSES, USER IS REDIRECTED TO THE HOME PAGE
export const addNewTicket = [
    ...validateTicket,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render('newTicketForm', {
                errors: errors.array(), 
            });
        }
        const { title, description, priority } = req.body;
        const user = req.user as AuthenticatedUser;
        const creator = user.id;

        try {
            await newTicket(title, description, priority, creator);
            res.redirect('/');
        } catch (error) {
            return res.status(500).render('newTicketForm', {
                errors: [{msg: "Oops, something went wrong. Please try again."}]
            })
        }
    }]

//RENDERS THE NEW TICKET FORM
export function showNewTicketForm(req: Request, res: Response){
    res.render('newTicketForm');
}

//GRABS THE TICKET ID FROM URL PARAMS AND USES IT TO FETCH THAT TICKET
//SENDS THE TICKET OBJ TO TICKET PAGE EJS
//ALSO PRINTS COMMENTS BASED ON TICKET ID
export async function showTicketPage(req: Request, res: Response){
    const ticketId = Number(req.params.id)
    let clickedTicket = await getTicketById(ticketId);
    let comments = await printCommentsByTicketId(ticketId)
    res.render('ticketPage', {
        clickedTicket,
        comments,
        user: req.user,
    });
}



