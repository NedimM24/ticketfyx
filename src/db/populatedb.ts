import { Client } from 'pg';
import 'dotenv/config';

const SQL = `

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_name VARCHAR ( 100 ) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'worker' CHECK (role in ('worker', 'developer', 'admin')),
  admin BOOLEAN NOT NULL DEFAULT FALSE,
  account_creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status in('open', 'in progress', 'testing', 'resolved')),
  priority TEXT NOT NULL DEFAULT 'low' CHECK(priority in('low', 'medium', 'high', 'critical')),
  ticket_creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  creator INTEGER REFERENCES users(id) ON DELETE CASCADE,
  assigned_developer INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  comment TEXT,
  comment_creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  creator INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE
);

TRUNCATE users, tickets, comments RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, password, role, admin)
VALUES
  ('alice_worker', '$2b$10$Wk8kZ8jGZ8yQ9F5Y5wq8XeQvL0y6z1Y5w1c8pJt9c3l4V2R6dGYji', 'worker', FALSE),
  ('bob_dev', '$2b$10$Wk8kZ8jGZ8yQ9F5Y5wq8XeQvL0y6z1Y5w1c8pJt9c3l4V2R6dGYji', 'developer', FALSE),
  ('carol_admin', '$2b$10$Wk8kZ8jGZ8yQ9F5Y5wq8XeQvL0y6z1Y5w1c8pJt9c3l4V2R6dGYji', 'admin', TRUE);

INSERT INTO tickets (title, description, status, priority, creator, assigned_developer)
VALUES
  (
    'Login page throws 500 error',
    'Users report a server error when submitting the login form with valid credentials.',
    'open',
    'high',
    (SELECT id FROM users WHERE user_name = 'alice_worker'),
    (SELECT id FROM users WHERE user_name = 'bob_dev')
  );

INSERT INTO comments (comment, creator, ticket_id)
VALUES
  (
    'Can confirm — looking into the session middleware now.',
    (SELECT id FROM users WHERE user_name = 'bob_dev'),
    (SELECT id FROM tickets WHERE title = 'Login page throws 500 error')
  );


`;

async function main() {
    console.log('seeding...');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('done');
}

main();