import connection from '../database/localDatabase.js';

async function getHabits({ habitId, userId }) {
    const queryArray = [];
    let queryText = `
    SELECT
        id,
        "userId",
        name,
        "creationDate",
        "deleteDate",
        "currentSequence",
        "highestSequence",
        "historyLastUpdate",
        array_agg(distinct "weekday") AS days
    FROM 
        (SELECT
            habits.id,
            habits.user_id AS "userId",
            habits.name,
            habits.creation_date AS "creationDate",
            habits.delete_date AS "deleteDate",
            habits.current_sequence AS "currentSequence",
            habits.highest_sequence AS "highestSequence",
            habits.history_last_update AS "historyLastUpdate",
            habit_days.weekday
        FROM habits
        JOIN habit_days ON habit_days.habit_id = habits.id) AS aux
        WHERE 1=1`;

    if (habitId) {
        queryArray.push(habitId);
        queryText += `AND aux.id = $${queryArray.length}`;
    }

    if (userId) {
        queryArray.push(userId);
        queryText += `AND aux."userId" = $${queryArray.length}`;
    }

    queryText += `
    GROUP BY
        id,
        "userId",
        name,
        "creationDate",
        "deleteDate",
        "currentSequence",
        "highestSequence",
        "historyLastUpdate";`;
    return (await connection.query(queryText, queryArray)).rows;
}

async function createNewHabit({ userId, name, days, today }) {
    const newHabit = (await connection.query(`
    INSERT INTO habits
        (user_id, name, creation_date, current_sequence, highest_sequence)
    VALUES
        ($1, $2, $3, 0, 0)
    RETURNING
        id,
        user_id AS "userId",
        name,
        creation_date AS "creationDate",
        current_sequence AS "currentSequence",
        highest_sequence AS "highestSequence",
        history_last_update AS "historyLastUpdate"
    ;`, [userId, name, today])).rows[0];

    const habitDaysParams = [newHabit.id];
    let habitDaysQueryText = `
    INSERT INTO habit_days
        (habit_id, weekday)
    VALUES `;
    days.forEach((day, index) => {
        habitDaysParams.push(day);
        habitDaysQueryText += `($1, $${habitDaysParams.length})`;
        if (index !== days.length - 1) {
            habitDaysQueryText += ' , ';
        }
    });
    await connection.query(`${habitDaysQueryText};`, habitDaysParams);
    return { ...newHabit, days };
}

function updateHabitsHistory(habits, today) {
    const queryParams = habits.map(({ id }) => id);
    let queryText = `
    UPDATE habits
    SET
        history_last_update = $1
    WHERE
    `;
    queryParams.forEach((id, index) => {
        queryText += ` id = $${index + 2}`;
        if (index !== queryParams.length - 1) {
            queryText += ' OR';
        }
    });
    return connection.query(`${queryText};`, [today, ...queryParams]);
}

export {
    getHabits,
    createNewHabit,
    updateHabitsHistory,
};
