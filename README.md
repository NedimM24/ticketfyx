# TicketFyx
<img width="2559" height="1393" alt="image" src="https://github.com/user-attachments/assets/8b615fec-ce6f-4c1e-9ad4-c4980583c1b9" />

A full-stack issue tracking platform where users can report, manage, and resolve software issues together. Built to practice authentication, relational database design, and role-based authorization.

Live demo: https://ticketfyx-production.up.railway.app
ADMIN LOGIN - nedAdmin@gmail.com / password123
(Demo data may be reset periodically. Feel free to explore admin features.)

## Overview

TicketFyx lets users sign up, submit tickets, track their progress, and collaborate through comments. Access is controlled through three roles:

- **Worker** - the default role for anyone who signs up. Can view all tickets and create new ones.
- **Developer** - unlocked by entering a passcode after signing up. Can update ticket status/priority and comment on tickets.
- **Admin** - has full control. Can assign developers to tickets, delete tickets, delete comments, and manage the platform.

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL
- **Auth:** Passport.js (local strategy), bcrypt, express-session with connect-pg-simple
- **Views:** EJS
- **Validation:** express-validator
- **Deployment:** Railway

## Features

- User registration and login with hashed passwords and persistent sessions
- Role-based access control enforced on both the UI and the server
- Ticket creation with title, description, and priority
- Developers can update ticket status and priority
- Comment system tied to tickets and users
- Admins can assign developers to tickets, delete tickets, and delete comments
- Server-side validation on all form inputs
- Parameterized SQL queries throughout to prevent injection

## Database Schema

Three main tables:

- **users** - stores account info and role (worker, developer, admin)
- **tickets** - stores ticket details, links to a creator and an optional assigned developer
- **comments** - links to both a ticket and the user who wrote it

Foreign keys with cascading deletes keep the data consistent when tickets or users are removed.

## Running Locally

1. Clone the repo and install dependencies
npm install

2. Set up a PostgreSQL database and add a `.env` file with:

DATABASE_URL=your_postgres_connection_string
SESSION_SECRET=your_session_secret
PORT=3000

3. Run the seed script to create tables and add sample data

npx ts-node src/db/populatedb.ts

4. Start the app

npm run dev

## Future Improvements

- Filtering and search on the ticket list (by status, priority, or keyword)
- Comment counts shown on each ticket in the list view
- Relative timestamps (e.g. "2 hours ago" instead of a raw date)
- Pagination for the ticket list
- Ticket editing for the original creator
- Email notifications when a ticket is assigned or commented on

## Author

Nedim Mulahusic
