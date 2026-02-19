
// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/");
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });


// const upload = multer({
//     storage,
//     limits: { fieldSize: 2 * 1024 * 1024 }, // 2MB limit
//     fileFilter: function (req, file, cb) {
//         const allowedTypes = /jpeg|jpg|png/;
//         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = allowedTypes.test(file.mimetype);

//         if (extname && mimetype) {
//             return cb(null, true);
//         }
//         else {
//             cb("Only images (jpg, jpeg, png) allowed");
//         }
//     }
// });

// module.exports = upload;


const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, "logo-" + Date.now() + ext);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
