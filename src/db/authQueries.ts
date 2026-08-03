import { pool } from './pool';

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