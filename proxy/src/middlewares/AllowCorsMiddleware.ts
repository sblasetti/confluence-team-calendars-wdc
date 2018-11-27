import { Request, Response, NextFunction } from 'express';

export const AllowCorsMiddleware = function() {
    return function (req: Request, res: Response, next: NextFunction) {
        // Allowing CORS
        // TODO: replace * with connector domain
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        console.log("set CORS header via middleware");
        next();
    }
}