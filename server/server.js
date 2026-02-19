require('dotenv').config()
const express = require('express');
const cors = require("cors");
const authRouter = require('./routes/authRoutes');
const customerRouter = require('./routes/customerRoutes');
const productRouter = require('./routes/productRoutes');
const invoiceRouter = require('./routes/invoiceRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const reportRouter = require('./routes/reportRoutes');
const businessRouter = require('./routes/businessRoutes');

const app = express()

const PORT = process.env.PORT || 5000


const allowsOrigins = [
    "http://localhost:5173",
]


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: allowsOrigins,
    credentials: true,
}))


app.use("/uploads", express.static("uploads"));



app.get("/", (req, res) => {
    res.send("Server running")
})


app.use("/api/auth", authRouter)
app.use("/api/customers", customerRouter)
app.use("/api/products", productRouter)
app.use("/api/invoices", invoiceRouter)
app.use('/api/payments', paymentRouter)
app.use("/api/reports", reportRouter)
app.use("/api/business", businessRouter)



app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

