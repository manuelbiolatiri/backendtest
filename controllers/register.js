const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../models/database');


const register = {
    async signUP(req, res) {
        // body values
        const { firstName, lastName, email, password, gender} = req.body;

        try {
            // empty body values
            if (!firstName || !lastName || !email || !password || !gender) {
                return res.status(400).json({
                    status: 'error',
                    error: 'all fields are required'
                });
            };

            // generate bcrypt salt
            const salt = await bcrypt.genSalt(10);
            // hash password
            const hashedPassword = await bcrypt.hash(password, salt);

            // check if user exist (email check)
            const checkQuery = `SELECT * FROM users WHERE email=$1`;
            const value = [email];
            const check = await pool.query(checkQuery, value);

            // check if user exist response
            if (check.rows[0]) {
                return res.status(400).json({
                    status: 'error',
                    error: 'user already exist'
                });
            }
            // admin signup
            else if (process.env.ADMIN_EMAIL === email && process.env.ADMIN_PASSWORD === password) {
                const AdminSignupQuery = `INSERT INTO users (firstName, lastName, email, password, gender, createdon)
                VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
                const values = [firstName, lastName, email, hashedPassword, gender, new Date().toLocaleString()];
                const adminResult = await pool.query(AdminSignupQuery, values);

                // generate admin token
                jwt.sign({ email, password }, process.env.SECRET_KEY, { expiresIn: '24h' }, (err, token) => {
                    res.status(201).json({
                        message: 'admin account successfully created',
                        token,
                        adminId: adminResult.rows[0].user_id
                    });
                });
            }
            else {
                // users sign up
                const signUpQuery = `INSERT INTO users (firstName, lastName, email, password, gender, createdon)
                VALUES($1, $2, $3, $4, $5, now()) RETURNING *`;
                const userValue = [firstName, lastName, email, hashedPassword, gender];
                const signUpQuerys = await pool.query(signUpQuery, userValue);

                if (email === signUpQuerys.rows[0].email) {
                    // generate user token
                    jwt.sign({ email, password }, process.env.SECRET_KEY, { expiresIn: '24h' }, (err, token) => {
                        // token response
                        res.status(201).json({
                            status: 'success',
                            data: {
                                message: 'user account successfully created',
                                token,
                                userId: signUpQuerys.rows[0].user_id
                            }
                        })
                    })
                } else {
                    res.status(400).json({
                        status: 'error',
                        error: 'account not created'
                    });
                }
            };
        }
        catch (e) {
            console.log(e);
        };
    },
    async logIn(req, res) {
        // body values
        const { email, password } = req.body;

        try {
            // empty body values
            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    error: 'all fields are required'
                });
            };

            // email check (if user with email exist) 
            const logIn = `SELECT * FROM users WHERE email=$1`;
            const value = [email];
            const logInQuery = await pool.query(logIn, value);

            // email check response
            if (!logInQuery.rows[0]) {
                return res.status(400).json({
                    status: 'error',
                    error: 'email does not exist, please sign up'
                });
            };

            // compare password
            bcrypt.compare(password, logInQuery.rows[0].password, (err, result) => {
                // admin login
                if (logInQuery.rows[0].email === process.env.ADMIN_EMAIL && result === true) {
                    jwt.sign({ email, password }, process.env.SECRET_KEY, { expiresIn: '24h' }, (err, token) => {
                        res.status(201).json({
                            status: 'success',
                            message: 'admin successfully loged in',
                            data: {
                                token,
                                adminId: logInQuery.rows[0].user_id
                            }
                        });
                    });
                }
                // user login
                else if (email === logInQuery.rows[0].email && result === true) {
                    jwt.sign({ email, password }, process.env.SECRET_KEY, { expiresIn: '24h' }, (err, token) => {
                        res.status(201).json({
                            status: 'success',
                            message: 'user successfully loged in',
                            data: {
                                token,
                                userId: logInQuery.rows[0].user_id
                            }
                        })
                    })
                }
                // incorrect email and password
                else {
                    res.status(403).json({
                        status: 'error',
                        error: 'token not generated, incorrect email or password'
                    });
                }
            });
        }
        catch (e) {
            console.log(e)
        };
    },
    // token verification
    verifyToken(req, res, next) {
        // header key and value
        const headers = req.headers['authorization'];

        if (typeof headers !== 'undefined') {
            const beareHeader = headers.split(' ');
            const token = beareHeader[1];

            req.token = token
            next();
        }
        else {
            // incorrect header and value
            res.status(403).json({
                status: 'error',
                error: 'forbidden'
            });
        };
    }
};

// export register routes
module.exports = register;