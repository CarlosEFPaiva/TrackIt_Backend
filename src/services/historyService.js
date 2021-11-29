import * as historyRepository from '../repositories/historyRepository.js';

function getNextSelectedWeekDay(fromDate, selectedWeekDay) {
    const desiredDate = new Date(fromDate);
    desiredDate.setDate(desiredDate.getDate()
        + (((selectedWeekDay + 7 - desiredDate.getDay()) % 7) || 7));
    return desiredDate;
}

function getNextDueDayIndex(currentDate, dueDays) {
    const currentWeekday = currentDate.getDay();
    const nextDueDayIndex = dueDays.findIndex((weekday) => weekday > currentWeekday);
    if (nextDueDayIndex === -1) return 0;
    return nextDueDayIndex;
}

function getHabitDueDates(lastUpdate, today, dueDays) {
    const habitDueDates = [];
    if (!lastUpdate) {
        if (dueDays.includes(today.getDay())) {
            habitDueDates.push(today);
        }
    } else {
        let currentDate = lastUpdate;
        let nextDueDateIndex = getNextDueDayIndex(currentDate, dueDays);
        let safetyCounter = 0;
        while (currentDate < today && safetyCounter < 10) {
            const nextDueWeekday = dueDays[nextDueDateIndex % dueDays.length];
            const nextDueDate = getNextSelectedWeekDay(currentDate, nextDueWeekday);
            if (nextDueDate > today) break;
            habitDueDates.push(nextDueDate);
            currentDate = nextDueDate;
            nextDueDateIndex += 1;
            safetyCounter += 1;
        }
    }
    return habitDueDates;
}

function updateHistory(userHabits) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const habitsToUpdate = [];
    userHabits.forEach((habit) => {
        const dueDates = getHabitDueDates(habit.historyLastUpdate, today, habit.days);
        if (dueDates.length) {
            habitsToUpdate.push({ id: habit.id, dueDates });
        }
    });
    if (!habitsToUpdate.length) {
        return '';
    }
    return historyRepository.addNewHistories(habitsToUpdate);
}

export {
    updateHistory,
};
