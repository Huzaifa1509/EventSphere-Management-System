const cloudinary = require("cloudinary").v2
const multer = require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")

const uploadImageHandler = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    })
    
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: "uploads",
            allowed_formats: ['png', 'svg', 'jpeg', 'jpg']
        }
    })

    const upload = multer({storage})
    return upload
}

module.exports = {uploadImageHandler}