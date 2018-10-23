import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/validate', (req: Request, res: Response) => {
    const payload = {

    };
    res.send(payload);
});

export const AuthController: Router = router;