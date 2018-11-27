import express from 'express';

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
    console.log('return fake user data');
    res.status(200).send({
        username: req.query.username
    });
});

// Serve the app
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
