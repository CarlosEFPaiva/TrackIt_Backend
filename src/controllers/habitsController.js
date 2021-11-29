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

export {
    createNewHabit,
};
