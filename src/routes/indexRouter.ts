import express from 'express';
import passport from 'passport';

import { home } from '../controllers/homeController';
import { showForm,
            addNewUser, 
            showLoginForm, 
            showDevRegisterForm,
            setRoleToDeveloper
        } from '../controllers/authController';

import { showNewTicketForm,
          addNewTicket,
          showTicketPage,
          handleUpdateTicketStatus
} from '../controllers/ticketController';

import { insertNewComment

 } from '../controllers/commentsController';  

import { isAuth, isAdmin, isDeveloper } from './authMiddleware';

const router = express.Router();

router.get('/', isAuth, home);

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

//CREATE ROUTES
router.post('/register', addNewUser);
router.post('/devRegister', isAuth, setRoleToDeveloper);
router.post('/newTicket', isAuth, addNewTicket);
router.post('/comment/:id', isAuth, insertNewComment);
router.post('/ticket/:id/status', isAuth,  handleUpdateTicketStatus);


//READ ROUTES
router.get('/register', showForm);
router.get('/login', showLoginForm);
router.get('/devRegister', isAuth, showDevRegisterForm);
router.get('/newTicket', isAuth, showNewTicketForm);
router.get('/ticketPage/:id', showTicketPage);

//LOGOUT
router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//Test PRINTS THE USER TO CONSOLE
router.get('/profile', (req, res ) => {
    console.log(req.user);
})

export default router;

