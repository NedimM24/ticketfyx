import { pool } from './pool';

type User = {
    id: number;
    email: string;
    password: string;
    role: string;
    account_creation_date: Date;
}

//Create query
export async function registerUser(
    email: string, 
    password: string, 
    ): Promise<void>{
        await pool.query(
            "INSERT INTO users(email, password) values ($1, $2)",
            [email, password],
        );
}

//QUERY TO SWITCH ROLE FROM WORKER TO DEVELOPER
export async function setRoleToDev(
    id:number
) : Promise <void>{
    await pool.query(
        "UPDATE users SET role = 'developer' WHERE id = $1",
        [id]
    )
}

//RETURNS AN ARRAY OF ALL USERS THE HAVE A DEV ROLE
export async function getAllDevs():Promise<User[]>{
    const result = await pool.query(
        `SELECT *
        FROM users
        WHERE role = 'developer' `
    )
    return result.rows;
}