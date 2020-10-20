const jwt = require('jsonwebtoken');
const pool = require('../models/database');

// comment controller
const comments = {
    async postComment (req, res) {
        // parameter (number)
        const id = parseInt(req.params.id)
        // body values
        const { comment, user_id } = req.body;
        try {
            // verify token
            jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
                // incorrect token
                if(err) {
                    return res.status(403).json({
                        status: 'error',
                        error: 'incorrect token'
                    })
                }
 
                // empty body values
                if (!comment || !user_id) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'all fields are required'
                    });
                }

                // select post query
                const check = `SELECT * FROM posts WHERE post_id=$1`;
                const checkValue = [id];
                const checkQuery = await pool.query(check, checkValue);

                // post check response
                if (!checkQuery.rows[0]) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'post does not exist'
                    });
                }

                // selected post comment query
                const comments = `INSERT INTO post_comments (comment, createdOn, user_id, post_id)
                                VALUES($1, $2, $3, $4) RETURNING *`;
                const values = [comment, new Date().toLocaleString(), user_id, id];
                const commentQuery = await pool.query(comments, values);
                
                // comment response
                res.status(201).json({
                    status: 'success',
                    data: {
                        message: 'Comment successfully created',
                        createdOn: commentQuery.rows[0].createdon,
                        postTitle: checkQuery.rows[0].title,
                        post: checkQuery.rows[0].post,
                        comment: commentQuery.rows[0].comment
                    }
                })
            })
        }
        catch (e) {
            console.log(e)
        }
    },
    deleteComment(req, res) {
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
                const check = `SELECT * FROM post_comments WHERE comment_id=$1`;
                const checkValue = [id];
                const checkQuery = await pool.query(check, checkValue);

                // post check response
                if (!checkQuery.rows[0]) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'comment does not exist'
                    });
                };

                // delete post query
                const remove = `DELETE FROM post_comments WHERE comment_id=$1`;
                const value = [id];
                const removeQuery = await pool.query(remove, value);

                // delete response
                res.status(200).json({
                    status: 'success',
                    data: {
                        message: 'comment successfully deleted'
                    }
                });

            })
        }
        catch (e) {
            console.log(e);
        };
    }

}

// export comments to routes
module.exports = comments;