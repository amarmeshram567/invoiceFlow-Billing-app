const express = require("express");
const auth = require("../middlewares/auth");
const { createInvoice, getInvoices } = require("../controllers/invoiceController");

const invoiceRouter = express.Router();


invoiceRouter.use(auth);

invoiceRouter.post('/', createInvoice);
invoiceRouter.get("/", getInvoices);


module.exports = invoiceRouter