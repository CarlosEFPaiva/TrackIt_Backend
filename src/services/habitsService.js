import * as habitsRepository from '../repositories/habitsRepository.js';
import * as historyService from './historyService.js';

async function createNewHabit({ userId, name, days }) {
    const today = new Date();
    days.sort((a, b) => a - b);
    const createdHabit = await habitsRepository.createNewHabit({ userId, name, days, today });
    await historyService.updateHistory([createdHabit]);
    await habitsRepository.updateHabitsHistory([createdHabit], today);
    return {
        id: createdHabit.id,
        name,
        days,
    };
}

export {
    createNewHabit,
};
