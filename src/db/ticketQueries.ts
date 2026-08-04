import { pool } from './pool';


//QUERY TO ADD A NEW TICKET TO THE DB
export async function newTicket(
    title: string,
    description: string,
    priority: string,
    creator: number
): Promise <void> {
    await pool.query(
    'INSERT INTO tickets (title, description, priority, creator) VALUES ($1, $2, $3, $4)', 
    [title, description, priority, creator]
    );
}