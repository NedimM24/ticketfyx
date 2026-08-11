import { pool } from './pool';

// Need to tell TS about the ticket
type Comment = {
    id: number;
    comment: string;
    comment_creation_date: Date;
    creator: number;
    ticket_id: number
}

//CREATE
//QUERY TO ADD A NEW COMMENT TO THE DB
export async function newComment(
    comment: string,
    creator: number,
    ticket_id: number
): Promise <void> {
    await pool.query(
    'INSERT INTO comments (comment, creator,  ticket_id) VALUES ($1, $2, $3)', 
    [comment, creator, ticket_id]
    );
}
