
const express = require('express');
const auth = require('../middlewares/auth');
const { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const customerRouter = express.Router();

customerRouter.use(auth);

customerRouter.post('/', createCustomer);
customerRouter.get('/', getCustomers);
customerRouter.get("/:id", getCustomerById);
customerRouter.put("/:id", updateCustomer);
customerRouter.delete("/:id", deleteCustomer);


module.exports = customerRouter