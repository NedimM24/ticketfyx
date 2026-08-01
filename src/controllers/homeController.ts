import type { Request, Response } from 'express';

export function home(req: Request, res: Response) {
    res.render('home', {user : req.user})
};