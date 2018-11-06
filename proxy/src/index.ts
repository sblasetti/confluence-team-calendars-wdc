import express from 'express';
import { AuthController } from './controllers';

const app: express.Application = express();
const port: number = 8008;

// Middlewares
app.use(express.json());

// Allowing CORS
// TODO: replace * with connector domain
app.use(function(req, res, next) {
    console.log("---");
    console.log("set CORS header");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Define controllers to use
app.use('/auth', AuthController);

// Serve the app
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
