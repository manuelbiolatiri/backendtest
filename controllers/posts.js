const jwt = require('jsonwebtoken');
const pool = require('../models/database');

// post conrtroller
const postController = {
    createPost(req, res) {
        // body values
        const { title, post, user_id } = req.body;

        try {
            // verify token
            jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
                // incorrect token
                if (err) {
                    return res.status(403).json({
                        status: 'error',
                        error: 'incorrect token'
                    })
                };

                // empty body values
                if (!title || !post || !user_id) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'all fields are required'
                    });
                };


                // database post post query
                const create = `INSERT INTO posts (title, post, user_id, createdon)
                                VALUES($1, $2, $3, $4) RETURNING *`;
                const values = [title, post, user_id, new Date().toLocaleString()];
                const createQuery = await pool.query(create, values);

                // post post response
                res.status(201).json({
                    status: 'success',
                    data: {
                        message: 'post successfully posted',
                        post_id: createQuery.rows[0].post_id,
                        createdOn: createQuery.rows[0].createdon,
                        title: createQuery.rows[0].title,
                        post: createQuery.rows[0].post
                    }
                })
            });

        }
        catch (e) {
            console.log(e);
        }
    },
    modifyPost(req, res) {
        //  parameter (number)
        const id = parseInt(req.params.id);

        try {
            // verify token
            jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {

                // incorrect token
                if (err) {
                    return res.status(403).json({
                        status: 'error',
                        error: 'incorrect token'
                    })
                };

                // select an post query
                const check = `SELECT * FROM posts WHERE post_id=$1`;
                const checkValue = [id];
                const checkQuery = await pool.query(check, checkValue);

                // post check response
                if (!checkQuery.rows[0]) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'post does not exist'
                    });
                };

                // body values
                const title = req.body.title || checkQuery.rows[0].title;
                const post = req.body.post || checkQuery.rows[0].post;

                // update selected post query
                const modify = `UPDATE posts SET title=$1, post=$2, updated_on=$3 WHERE post_id=$4 RETURNING *`;
                const value = [title, post, new Date().toLocaleString(), id];
                const modifyQuery = await pool.query(modify, value)

                // update response
                res.status(200).json({
                    status: 'success',
                    data: {
                        message: 'post successfully updated',
                        title: title,
                        post: post,
                        updated_on: modifyQuery.rows[0].updated_on
                    }
                });
            });

        }
        catch (e) {
            console.log(e)
        };
    },
    deletePost(req, res) {
        //  parameter (number)
        const id = parseInt(req.params.id);
        try {
            // verify token
            jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
                // incorrect token
                if (err) {
                    return res.status(403).json({
                        status: 'error',
                        error: 'incorrect token'
                    });
                };

                // select an post query
                const check = `SELECT * FROM posts WHERE post_id=$1`;
                const checkValue = [id];
                const checkQuery = await pool.query(check, checkValue);

                // post check response
                if (!checkQuery.rows[0]) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'post does not exist'
                    });
                };

                // delete post query
                const remove = `DELETE FROM posts WHERE post_id=$1`;
                const value = [id];
                const removeQuery = await pool.query(remove, value);

                // delete response
                res.status(200).json({
                    status: 'success',
                    data: {
                        message: 'post successfully deleted'
                    }
                });

            })
        }
        catch (e) {
            console.log(e);
        };
    }
}

// export post controller to routes
module.exports = postController;
