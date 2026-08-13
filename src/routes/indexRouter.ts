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
          handleUpdateTicketStatus,
          handleUpdateTicketPriority,
          handleDeleteTicketById
} from '../controllers/ticketController';

import { handleDeleteCommentById, insertNewComment

 } from '../controllers/commentsController';  

import { isAuth, isAdmin, isDeveloper } from './authMiddleware';

const router = express.Router();

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

//READ ROUTES
router.get('/', isAuth, home);
router.get('/register', showForm);
router.get('/login', showLoginForm);
router.get('/devRegister', isAuth, showDevRegisterForm);
router.get('/newTicket', isAuth, showNewTicketForm);
router.get('/ticketPage/:id', showTicketPage);

//UPDATE ROUTES
router.post('/ticket/:id/status', isAuth,  handleUpdateTicketStatus);
router.post('/ticket/:id/priority', isAuth,  handleUpdateTicketPriority);

//DELETE ROUTES
router.post('/ticketPage/:id/delete', isAdmin, handleDeleteTicketById);
router.post('/ticketPage/:ticketId/comments/:commentId/delete', isAdmin, handleDeleteCommentById);


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

