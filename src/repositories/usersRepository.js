import connection from '../database/localDatabase.js';

async function getUser({ email, token }) {
    const queryParams = [];
    let queryText = `
        SELECT
            users.*
        FROM users`;
    if (token) {
        queryText += ' JOIN sessions ON users.id = sessions.user_id';
    }

    queryText += ' WHERE 1=1';

    if (email) {
        queryParams.push(email);
        queryText += ` AND users.email = $${queryParams.length}`;
    }
    if (token) {
        queryParams.push(token);
        queryText += ` AND sessions.token = $${queryParams.length}`;
    }
    const result = await connection.query(`${queryText};`, queryParams);
    return result.rows[0];
}

function addNewUser({ name, email, password, image }) {
    return connection.query(`
        INSERT INTO users 
        (name, email, password, image) 
        VALUES ($1, $2, $3, $4) RETURNING *;`, [name, email, password, image]);
}

export {
    getUser,
    addNewUser,
};
