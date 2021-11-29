import * as usersRepository from '../repositories/usersRepository.js';
import * as isValid from '../utils/externalLibs/validation.js';

export default async function validateToken(req, res, next) {
    try {
        res.locals.token = req.headers.authorization?.replace('Bearer ', '');
        if (!res.locals.token || !isValid.token(res.locals.token)) return res.status(401).send('Valid token is required for access');

        res.locals.user = await usersRepository.getUser({ token: res.locals.token });
        if (!res.locals.user) return res.status(404).send('No session was found for that token');
        return next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}
