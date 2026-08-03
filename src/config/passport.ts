import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local';
import bcrypt from 'bcryptjs';
import { pool } from '../db/pool';

//Find the user by email and verify the pw
const verifyCallback: VerifyFunction = async (email, password, done) => {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        const user = rows[0];

        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);

    } catch (err) {
        return done(err);
    }
};

const strategy = new LocalStrategy({usernameField: "email"}, verifyCallback); 

passport.use(strategy)

// stores the users ID in the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

//Retrieves the full user from the database using the ID stored in the session
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});
