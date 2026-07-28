import type { Request, Response } from 'express';

export function test(_req: Request, res: Response) {
    res.render('test')
};