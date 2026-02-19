
const express = require('express');
const auth = require('../middlewares/auth');
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const productRouter = express.Router();


productRouter.use(auth);

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);



module.exports = productRouter
