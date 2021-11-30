import * as habitsRepository from '../repositories/habitsRepository.js';
import { wasHabitCreatedToday } from '../utils/sharedFunctions.js';
import * as historyService from './historyService.js';

async function updateHabitsAndHistoryDatabases(habits) {
    const today = new Date();
    await historyService.updateHistory(habits);
    await habitsRepository.updateHabitsHistory(habits, today);
}

async function createNewHabit({ userId, name, days }) {
    const today = new Date();
    days.sort((a, b) => a - b);
    const createdHabit = await habitsRepository.createNewHabit({ userId, name, days, today });
    await updateHabitsAndHistoryDatabases([createdHabit]);
    return {
        id: createdHabit.id,
        name,
        days,
    };
}

async function getUserHabits({ userId }) {
    const userHabits = await habitsRepository.getHabits({ userId });
    await updateHabitsAndHistoryDatabases(userHabits);
    return userHabits.map(({ id, name, days }) => ({ id, name, days }));
}

async function deleteHabit({ userId, habitId }) {
    const habit = await habitsRepository.getHabits({ userId, habitId });
    if (!habit || habit.deleteDate) return '';

    await historyService.eraseTodaysHabitHistory(habitId);
    if (wasHabitCreatedToday(habit)) {
        return habitsRepository.deleteHabit(habitId);
    }
    const today = new Date();
    return habitsRepository.addDeleteDate({ habitId, today });
}

export {
    createNewHabit,
    getUserHabits,
    deleteHabit,
};
