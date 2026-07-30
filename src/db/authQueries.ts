import { pool } from './pool';

//Create query
export async function registerUser(
    email: string, 
    password: string, 
    ): Promise<void>{
        await pool.query(
            'INSERT INTO users(email, password) values ($1, $2)',
            [email, password],
        );
}