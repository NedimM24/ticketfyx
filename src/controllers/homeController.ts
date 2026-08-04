import type { Request, Response } from 'express';
import { getAllTickets } from '../db/ticketQueries';

//Renders the home page while passing ejs the tickets array
export async function home(req:Request, res: Response){
    try {
        const tickets = await getAllTickets();
        res.render('home', {user: req.user, tickets});
    } catch (error) {
        res.status(500).send('Something went wrong loading the tickets')
    }
}