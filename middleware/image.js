const imgMiddleware = {
    checkPostImage (req, res, next) {
        let image = req.files.image;

        if (!image.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return res.status(400).json({
                status: 'error',
                error: 'image upload must be a gif, jpg, jpeg or png'
            })
        }
        next();
    }
}

module.exports = imgMiddleware;