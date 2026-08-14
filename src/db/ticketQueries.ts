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
    assigned_developer_email: string | null;
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
        `SELECT 
            tickets.*,
            creator_user.email AS creator_email,
            developer_user.email AS assigned_developer_email
         FROM tickets
         JOIN users AS creator_user
            ON tickets.creator = creator_user.id
         LEFT JOIN users AS developer_user
            ON tickets.assigned_developer = developer_user.id
         ORDER BY ticket_creation_date DESC`
    )
    return result.rows;
}

//GETS MY TICKETS, JOINED WITH USERS TO INCLUDE CREATORS EMAIL. EASIER TO DISPLAY
export async function getMyTickets(id: number): Promise<Ticket[]>{
    const result = await pool.query(
        `SELECT 
            tickets.*,
            creator_user.email AS creator_email,
            developer_user.email AS assigned_developer_email
         FROM tickets
         JOIN users AS creator_user
            ON tickets.creator = creator_user.id
         LEFT JOIN users AS developer_user
            ON tickets.assigned_developer = developer_user.id
         WHERE tickets.creator = $1
         ORDER BY ticket_creation_date DESC`,
         [id]
    )
    return result.rows;
}

export async function getTicketById(id: number): Promise<Ticket | null> {
    const result = await pool.query(
         `SELECT tickets.*, 
            creator_user.email AS creator_email,
            developer_user.email AS assigned_developer_email
         FROM tickets
         JOIN users AS creator_user
            ON tickets.creator = creator_user.id
         LEFT JOIN users AS developer_user
            ON tickets.assigned_developer = developer_user.id
         WHERE tickets.id = $1
         ORDER BY ticket_creation_date DESC`,
         [id]

    )
    return result.rows[0] ?? null;
}

//UPDATE

//UPDATES TICKET STATUS BASED ON PASSED ID FROM THE URL PARAMS AND STATUS FROM REQ BODY
export async function updateTicketStatus(id: number, status: string): Promise<void>{
    await pool.query(
        `UPDATE tickets
        SET status = $1
        WHERE id = $2`,
        [status, id]
    )
}

//UPDATES TICKET STATUS BASED ON PASSED ID FROM THE URL PARAMS AND STATUS FROM REQ BODY
export async function updateTicketPriority(id: number, priority: string): Promise<void>{
    await pool.query(
        `UPDATE tickets
        SET priority = $1
        WHERE id = $2`,
        [priority, id]
    )
}

//UPDATES THE CURRENT TICKET TO HAVE ASSIGNED DEV THATS PASSED IN
//USED IN TICKET CONTROLLER
export async function updateAssignedDev(ticket_id: number, dev_id: number): Promise<void>{
    await pool.query(
        `UPDATE tickets
        SET assigned_developer = $1
        WHERE id = $2`,
        [dev_id, ticket_id]
    )
}

//DELETE

//DELETES TICKET BASED ON THE GIVEN TICKET ID
//ID WILL BE BASED ON THE PARAM ON TICKETPAGE
export async function deleteTicketById(id: number): Promise<void>{
    await pool.query(
        `DELETE FROM tickets
        WHERE id = $1`,
        [id]
    )
} 