import { newComment, deleteCommentById } from "../db/commentQueries";
import type { Request, Response } from 'express';
import { body, validationResult, Meta } from 'express-validator';

// Need to tell TS about the user
type AuthenticatedUser = {
    id: number;
    email: string;
    password: string;
    role: string;
    account_creation_date: Date;
}

const lengthErr = "Comment must be between 3 and 500 characters."

const validateComment = [
    body('comment').trim()
        .isLength({min: 3, max: 500}).withMessage(lengthErr),
]

export const insertNewComment = [
    ...validateComment,
    async(req: Request, res: Response) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render('ticketPage', {
                errors: errors.array(),
            });
        }
        try {
            //CREATOR IS FOUND USING LOGGED IN USER (req.user)
            const user = req.user as AuthenticatedUser;
            const creator = user.id;
            //TICKET ID IS FOUND WITH PARAMS FROM URL
            const ticket_id = Number(req.params.id)
            //COMMENT IS FOUND WITH REQ BODY FROM USER INPUT IN TICKETPAGE
            const { comment } = req.body;
            await newComment(comment, creator, ticket_id);
            res.redirect(`/ticketPage/${ticket_id}`)
        } catch (error) {
            return res.status(400).render('ticketPage', {
                errors: [{msg: 'Something went wrong, please try again'}]
            })
        }
    }
];

//FUNCTION THAT DELETES THE COMMENT WHEN ADMIN CLICKS DELETE BUTTON
//COMMENT AND TICKET ID ARE GRABBED FROM THE URL PARAMS ON TICKET PAGE
export async function handleDeleteCommentById(req: Request, res: Response){
    const comment_id = Number(req.params.commentId);
    const ticket_id = Number(req.params.ticketId);
    
    try {
        await deleteCommentById(comment_id);
    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong when trying to delete the comment.')
    }
    res.redirect(`/ticketPage/${ticket_id}`)
}


