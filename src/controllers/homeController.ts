import type { Request, Response } from 'express';
import { getAllTickets, getMyTickets } from '../db/ticketQueries';

// Need to tell TS about the user
type AuthenticatedUser = {
    id: number;
    email: string;
    password: string;
    role: string;
    account_creation_date: Date;
}

//CHECKS WHICH TICKETS BUTTON IS CLICKED AND UPDATES TICKETS ACCORDING TO THE FILTER
//ACTIVE FILTER IS ADDED FOR STYLING DOWN THE LINE
export async function home(req:Request, res: Response){
    try {
        const user = req.user as AuthenticatedUser;
        const filter = req.query.filter;

        let tickets;
        if(filter === 'mine') {
            tickets = await getMyTickets(user.id);
        } else {
            tickets = await getAllTickets()
        }
                                           //active filter will be used for styling
        res.render('home', {user, tickets, activeFilter: filter});
    } catch (error) {
        res.status(500).send('Something went wrong loading the tickets')
    }
}


/**
 * try {
        const tickets = await getAllTickets();
        res.render('home', {user: req.user, tickets});
    } catch (error) {
        res.status(500).send('Something went wrong loading the tickets')
    }
 * 
 * 
 */