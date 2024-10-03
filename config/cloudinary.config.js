const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        allowedFormats: ['jpg', 'png'],
        folder: 'portfolio'
        //resource_type: 'raw' => this is in case you want to upload other type of files, not just images
    }
});


module.exports = multer({ storage});