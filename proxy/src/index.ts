import express from 'express';
import { AuthController } from './controllers';

const app: express.Application = express();
const port: number = 8008;

// Define controllers to use
app.use('/auth', AuthController);

// Serve the app
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
