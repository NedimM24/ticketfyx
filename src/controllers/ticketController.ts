import type { Request, Response } from 'express';

export function test(req: Request, res: Response) {
    res.render('test', {user : req.user})
};