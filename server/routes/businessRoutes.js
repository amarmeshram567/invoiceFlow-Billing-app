const express = require("express");
const { getBusiness, updateBusiness } = require("../controllers/businessController");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const businessRouter = express.Router();

businessRouter.use(auth)

businessRouter.get("/", getBusiness);
businessRouter.put("/", upload.single("logo"), updateBusiness);


module.exports = businessRouter