const express = require('express');
const { dailySales, monthlySales, outstanding } = require('../controllers/reportController');
const auth = require('../middlewares/auth');


const reportRouter = express.Router();

reportRouter.use(auth)


reportRouter.get("/daily-sales", dailySales);
reportRouter.get('/monthly-sales', monthlySales);
reportRouter.get("/outstanding", outstanding);


module.exports = reportRouter