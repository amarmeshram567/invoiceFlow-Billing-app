const express = require('express');
const auth = require('../middlewares/auth');
const { addPayment, getPayments, getPaymentMode } = require('../controllers/paymentController');
const paymentRouter = express.Router();

paymentRouter.use(auth);

paymentRouter.get("/", getPayments)
paymentRouter.post("/", addPayment);
paymentRouter.get('/payment-modes', getPaymentMode)


module.exports = paymentRouter