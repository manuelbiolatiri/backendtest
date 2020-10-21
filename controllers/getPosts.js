const jwt = require('jsonwebtoken');
const pool = require('../models/database');

const getPost = {
    getAllposts(req, res) {
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

                // get all posts query 
                const getPosts = await pool.query(`SELECT * FROM posts`);

                // if there are no posts available
                if (!getPosts.rowCount) {
                    return res.status(400).json({
                        status: 'error',
                        error: 'sorry, there are no posts available in the database'
                    });
                };

                // get response
                res.status(200).json({
                    status: 'success',
                    data: {
                          posts: getPosts.rows
                        }
                });
            });
        }
        catch (e) {
            console.log(e)
        };
    },
    getSinglePost(req, res) {
        // parameter (number)
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

                // select single post query
                const getSinglePost = `SELECT * FROM posts WHERE post_id=$1`;
                const value = [id]
                const getSinglePostQuery = await pool.query(getSinglePost, value);

                // get all comments associated with the selected post
                const comment = await pool.query(`SELECT comment_id, comment, user_id FROM post_comments WHERE post_id=${id}`);

                // get response
                res.status(200).json({
                    status: 'success',
                    data: {
                        commentCount: comment.rowCount,
                        id: getSinglePostQuery.rows[0].post_id,
                        createdOn: getSinglePostQuery.rows[0].createdon,
                        title: getSinglePostQuery.rows[0].title,
                        post: getSinglePostQuery.rows[0].post,
                        comment: comment.rows
                    }
                });
            });
        }
        catch (e) {
            console.log(e)
        };
    }

}

module.exports = getPost;
