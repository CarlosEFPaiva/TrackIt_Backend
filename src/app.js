import express from 'express';
import cors from 'cors';

import * as usersController from './controllers/usersController.js';
import * as habitsController from './controllers/habitsController.js';
import validateToken from './middleware/authorization.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/status', (req, res) => {
    res.sendStatus(200);
});

app.post('/auth/sign-up', usersController.createNewUser);
app.post('/auth/login', usersController.signIn);

app.get('/habits');
app.post('/habits', validateToken, habitsController.createNewHabit);
app.delete('/habits/:habitId');

app.get('/habits/today');
app.get('/habits/today/daily');
app.post('habits/:habitId/:selectionState');

export default app;
