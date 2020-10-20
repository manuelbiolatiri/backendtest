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
        user_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
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

// post table
const postTable = async () => {
    const postTableQuery = `CREATE TABLE IF NOT EXISTS
    posts(
        post_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
        user_id INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        post VARCHAR(5000) NOT NULL,
        createdon VARCHAR(50) NOT NULL,
        updated_on VARCHAR(50),
        FOREIGN KEY(user_id) REFERENCES users(user_id)  ON DELETE CASCADE ON UPDATE CASCADE
    )`;

    try{
        await pool.query(postTableQuery);
        console.log('posts table created');
    }
    catch(e) {
        console.log(e)
    }
};

// post comment table
const postCommentTable = async () => {
    const postCommentTableQuery = `CREATE TABLE IF NOT EXISTS
    post_comments(
        comment_id SERIAL PRIMARY KEY NOT NULL UNIQUE,
        user_id INT NOT NULL,
        post_id INT NOT NULL,
        comment VARCHAR(300) NOT NULL,
        createdOn VARCHAR(50) NOT NULL,
        FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    )`;

    try{
        await pool.query(postCommentTableQuery);
        console.log('post comment table created')
    }
    catch(e) {
        console.log(e)
    }
};


// user
userTable();
// post
postTable();
// post comment
postCommentTable();

// export pool to controllers
module.exports = pool;