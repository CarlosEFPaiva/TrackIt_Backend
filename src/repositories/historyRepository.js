import connection from '../database/localDatabase.js';

function addNewHistories(habitsToUpdate) {
    const queryParams = [];
    let queryText = `
    INSERT INTO history
        (habit_id, date)
    VALUES `;
    habitsToUpdate.forEach(({ id, dueDates }, habitIndex) => {
        queryParams.push(id);
        const idIndex = queryParams.length;
        dueDates.forEach((date, dateIndex) => {
            queryParams.push(date);
            queryText += `($${idIndex}, $${queryParams.length})`;
            if (dateIndex !== dueDates.length - 1) {
                queryText += ', ';
            }
        });
        if (habitIndex !== habitsToUpdate.length - 1) {
            queryText += ', ';
        }
    });
    return connection.query(`${queryText} RETURNING *;`, queryParams);
}

export {
    addNewHistories,
};
