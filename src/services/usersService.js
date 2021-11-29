import * as usersRepository from '../repositories/usersRepository.js';
import * as sessionsRepository from '../repositories/sessionsRepository.js';
import { isPasswordCorrect, encryptPassword } from '../utils/externalLibs/encrypting.js';
import { generateToken } from '../utils/externalLibs/tokenGeneration.js';
import { capitalizeFirstLetters } from '../utils/sharedFunctions.js';

async function createNewUser({ name, email, password, image }) {
    const adjustedName = capitalizeFirstLetters(name);
    const lowerCaseEmail = email.toLowerCase();
    const isEmailRegistered = await usersRepository.getUser({ email: lowerCaseEmail });
    if (isEmailRegistered) {
        return '';
    }
    return usersRepository.addNewUser({
        name: adjustedName,
        email: lowerCaseEmail,
        password: encryptPassword(password, 10),
        image,
    });
}

async function getUserData({ email, password }) {
    const lowerCaseEmail = email.toLowerCase();
    const savedUser = (await usersRepository.getUser({ email: lowerCaseEmail }));
    if (!savedUser) {
        return '';
    }
    if (!isPasswordCorrect(password, savedUser.password)) {
        return '';
    }
    const token = generateToken();
    await sessionsRepository.insertNewSession({ userId: savedUser.id, token });
    delete savedUser.password;
    return {
        ...savedUser,
        token,
    };
}

export {
    createNewUser,
    getUserData,
};
