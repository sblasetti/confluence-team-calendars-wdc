import { NextFunction, Response, Request } from "express";

export const CorsMiddleware = () => {
    return function CorsMiddleware(req: Request, res: Response, next: NextFunction) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3003'); // temporary allowing the connector as origin

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        // res.setHeader('Access-Control-Allow-Credentials', 'true');

        next();
    };
}