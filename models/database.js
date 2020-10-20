const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// connect to database
const connection = {
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
};

// pool
const pool = new pg.Pool(connection);

pool.on('connect', () => {})

// user table
const userTable = async () => {
    const userTableQuery = `CREATE TABLE IF NOT EXISTS
    users(
        userId SERIAL PRIMARY KEY NOT NULL UNIQUE,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(200) NOT NULL,
        gender VARCHAR(20) NOT NULL,
        createdOn VARCHAR(50) NOT NULL
    )`;

    try {
        await pool.query(userTableQuery);
        console.log('users table created')
    }
    catch (e) {
        console.log(e)
    }
};

// user
userTable();

// export pool to controllers
module.exports = pool;