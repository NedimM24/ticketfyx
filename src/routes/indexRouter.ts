import express from 'express';
import passport from 'passport';

import { home } from '../controllers/homeController';
import { showForm,
            addNewUser, 
            showLoginForm, 
        } from '../controllers/authController';

import { isAuth } from './authMiddleware';

const router = express.Router();

router.get('/', isAuth, home);

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

//CREATE
router.post('/register', addNewUser);

//READ
router.get('/register', showForm);
router.get('/login', showLoginForm)

//LOGOUT
router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


//Test
router.get('/profile', (req, res ) => {
    console.log(req.user);
})



export default router;

