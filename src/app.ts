import express from 'express';
import router from './routes/indexRouter';
import 'dotenv/config';
import { pool } from './db/pool';
import flash from 'connect-flash';
import "./config/passport";
import path from "path";

import session from 'express-session';
import passport from 'passport';

const pgSession = require("connect-pg-simple")(session);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: new pgSession({
        pool,
        tableName: "session",
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));