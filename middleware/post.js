const postCheck = {
    checkPost_ModifyPost (req, res ,next) {
        const { title, post } = req.body;

        if (title.length < 3) {
            return res.status(400).json({
                status: 'error',
                error: 'title input length should be more than two characters'
            })
        }

        if (post.length < 20) {
            return res.status(400).json({
                status: 'error',
                error: 'post input length should be more than nineteen characters'
            })
        }
        next();
    }
}

// export postCheck to routes
module.exports = postCheck;
