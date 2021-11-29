import * as isValid from '../utils/externalLibs/validation.js';
import * as habitsService from '../services/habitsService.js';

async function createNewHabit(req, res) {
    const { name, days } = req.body;
    if (!isValid.newHabit({ name, days })) {
        return res.status(400).send('Error with inputs validation');
    }
    try {
        const userId = res.locals.user.id;
        const createdHabit = await habitsService.createNewHabit({ userId, name, days });
        return res.send(createdHabit);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function getHabits(req, res) {
    try {
        const userId = res.locals.user.id;
        const userHabits = await habitsService.getUserHabits({ userId });
        return res.send(userHabits);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {
    createNewHabit,
    getHabits,
};
