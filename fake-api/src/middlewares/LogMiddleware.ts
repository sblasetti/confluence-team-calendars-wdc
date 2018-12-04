import { NextFunction, Response, Request } from "express";

export const LogMiddleware = () => {
    return function LogMiddleware(req: Request, res: Response, next: NextFunction) {
        console.log(`${req.method} ${req.url}`);
        next();
    };
}