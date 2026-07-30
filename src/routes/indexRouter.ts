import express from 'express';

import { test } from '../controllers/ticketController';
import { showForm, addNewUser } from '../controllers/authController';

const router = express.Router();

router.get('/', test);

//CREATE
//router.post('/register', addNewUser);

//READ
router.get('/register', showForm);



export default router;

