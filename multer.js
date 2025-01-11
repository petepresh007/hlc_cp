const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },
    filename: (res, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})


//aws storage

const upload = multer({ storage: storage });

module.exports = {
    upload,
}