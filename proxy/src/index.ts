import express from 'express';
import { AuthController } from './controllers';
import { AllowCorsMiddleware } from './middlewares';
import { Request, Response, NextFunction } from 'express';

const app: express.Application = express();
const port: number = 8008;

// Middlewares
app.use(express.json());

app.use(function (req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Define controllers to use
app.use('/auth', AllowCorsMiddleware(), AuthController);

// Serve the app
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
