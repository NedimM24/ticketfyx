import { pool } from './pool';

//Create query
export async function registerUser(
    user_name: string, 
    password: string, 
    ): Promise<void>{
        await pool.query(
            'INSERT INTO users(user_name, password) values ($1, $2)',
            [user_name, password],
        );
}