import { newComment } from "../db/commentQueries";
import type { Request, Response } from 'express';

// Need to tell TS about the user
type AuthenticatedUser = {
    id: number;
    email: string;
    password: string;
    role: string;
    account_creation_date: Date;
}

export async function insertNewComment(req: Request, res: Response){

    const user = req.user as AuthenticatedUser;
    const creator = user.id;
    const ticket_id = Number(req.params.id)
    const { comment } = req.body;
    
    newComment(comment, creator, ticket_id);
}