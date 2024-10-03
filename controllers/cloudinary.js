const multer = require('../config/cloudinary.config');

const postNewPhoto = (req, res, next) => {
    const imageUrl = req.file.path;
    res.send({
        imageUrl
    })
    }

    module.exports = {
        postNewPhoto
    }