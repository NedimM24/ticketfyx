import express from 'express';

import { test } from '../controllers/ticketController';

const router = express.Router();

router.get('/', test)



export default router;

