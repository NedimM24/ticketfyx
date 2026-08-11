import { pool } from './pool';

// Need to tell TS about the ticket
type Comment = {
    id: number;
    comment: string;
    comment_creation_date: Date;
    creator: number;
    creator_email: string;
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

//READ

//QUERY TO PRINT ALL COMMENTS BASED ON TICKET ID, SORTED BY NEWEST COMMENT FIRST
//CREATE A RESULT OBJECT FROM THE QUERY THEN RETURN ITS ROWS WHICH CONTAIN COMMENTS 
export async function printCommentsByTicketId(
    ticket_id: number
): Promise <Comment[]>{
    const result = await pool.query(
        `SELECT comments .*, users.email AS creator_email
          FROM comments 
          JOIN users ON comments.creator = users.id
          WHERE comments.ticket_id = $1 
          ORDER BY comments.comment_creation_date DESC`,
          [ticket_id]
    )
    return result.rows;
}
