import express from 'express';
import { AuthController } from './controllers';

const app: express.Application = express();
const port: number = 8008;

// Middlewares
app.use(express.json());

// Allowing CORS
// TODO: replace * with connector domain
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// Define controllers to use
app.use('/auth', AuthController);

// Serve the app
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
