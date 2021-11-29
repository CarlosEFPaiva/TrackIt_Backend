import * as isValid from '../utils/externalLibs/validation.js';
import * as usersService from '../services/usersService.js';

async function createNewUser(req, res) {
    const {
        name,
        email,
        password,
        image,
    } = req.body;
    if (!isValid.signUp({ name, email, password, image })) {
        return res.status(400).send('Error with inputs validation');
    }
    try {
        const addedUser = await usersService.createNewUser({ name, email, password, image });
        if (!addedUser) {
            return res.status(409).send('This email is already registered');
        }
        return res.sendStatus(201);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function signIn(req, res) {
    const { email, password } = req.body;
    if (!isValid.signIn({ email, password })) {
        return res.status(400).send('Error with inputs validation');
    }
    try {
        const token = await usersService.getUserToken({ email, password });
        if (!token) {
            return res.status(401).send('Email and/or password are incorrect');
        }
        return res.send({ token });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {
    createNewUser,
    signIn,
};
