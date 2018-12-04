import express from 'express';
import * as userJson from './data/user.json';
import * as eventsJson from './data/events.json';

const app: express.Application = express();
const port: number = 3005;

// Middlewares
app.use(express.json());

app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Fake method to retrieve user information
app.get('/rest/api/user', (req: express.Request, res: express.Response) => {
    console.log('return fake user data (user must be "test")');
    if (req.query.username === "test") {
        res.status(200).send(userJson);
    } else {
        res.status(404).send({});
    }
});

// Fake method to retrieve events
app.get('/rest/calendar-services/1.0/calendar/events.json', (req: express.Request, res: express.Response) => {
    console.log('return fake events data');
    res.status(200).send(eventsJson);
});

// Serve the app
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
