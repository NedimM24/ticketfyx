import { pool } from './pool';

// Need to tell TS about the ticket
type Ticket = {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    ticket_creation_date: Date;
    creator: number;
    creator_email: string;
    assigned_developer: number | null;
}

//CREATE
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

//READ
//GETS ALL TICKETS, JOINED WITH USERS TO INCLUDE CREATORS EMAIL. EASIER TO DISPLAY
export async function getAllTickets(): Promise<Ticket[]>{
    const result = await pool.query(
        `SELECT tickets.*, users.email AS creator_email
         FROM tickets
         JOIN users ON tickets.creator = users.id 
         ORDER BY ticket_creation_date DESC`
    )
    return result.rows;
}

//GETS MY TICKETS, JOINED WITH USERS TO INCLUDE CREATORS EMAIL. EASIER TO DISPLAY
export async function getMyTickets(id: number): Promise<Ticket[]>{
    const result = await pool.query(
        `SELECT tickets.*, users.email AS creator_email
         FROM tickets
         JOIN users ON tickets.creator = users.id 
         WHERE tickets.creator = $1
         ORDER BY ticket_creation_date DESC`,
         [id]
    )
    return result.rows;
}

export async function getTicketById(id: number): Promise<Ticket | null> {
    const result = await pool.query(
         `SELECT tickets.*, users.email AS creator_email
         FROM tickets
         JOIN users ON tickets.creator = users.id 
         WHERE tickets.id = $1
         ORDER BY ticket_creation_date DESC`,
         [id]

    )
    return result.rows[0] ?? null;
}


//UPDATE


//DELETE