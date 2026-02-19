const pool = require("../config/db");
const invoiceService = require("../services/invoiceService");

const createInvoice = async (req, res, next) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const { customer_id, items, discount = 0 } = req.body;

        const businessRes = await client.query(
            `SELECT id FROM businesses WHERE user_id=$1`,
            [req.user.id]
        );

        if (!businessRes.rows.length) {
            return res.status(404).json({
                success: false,
                message: "Business not found for this user"
            });
        }

        const business_id = businessRes.rows[0].id;

        const customerRes = await client.query(
            `SELECT id FROM customers WHERE id=$1 AND business_id=$2`,
            [customer_id, business_id]
        );

        if (!customerRes.rows.length) {
            return res.status(404).json({
                success: false,
                message: "Customer not found for this business"
            });
        }

        let subtotal = 0, cgst = 0, sgst = 0, igst = 0;

        for (const item of items) {
            subtotal += item.price * item.qty;
            cgst += (item.price * item.qty * (item.tax / 2)) / 100;
            sgst += (item.price * item.qty * (item.tax / 2)) / 100;
        }

        const total = subtotal + cgst + sgst - discount;

        const invNoRes = await client.query(
            `SELECT COALESCE(MAX(invoice_number),0)+1 AS num 
       FROM invoices WHERE business_id=$1`,
            [business_id]
        );
        const invoice_number = invNoRes.rows[0].num;

        const invoiceRes = await client.query(
            `INSERT INTO invoices 
       (business_id, customer_id, invoice_number, subtotal, cgst, sgst, igst, discount, total_amount, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'UNPAID') RETURNING *`,
            [business_id, customer_id, invoice_number, subtotal, cgst, sgst, igst, discount, total]
        );

        const invoice_id = invoiceRes.rows[0].id;

        for (const item of items) {
            await client.query(
                `INSERT INTO invoice_items (invoice_id, product_id, quantity, price, tax_percent)
         VALUES ($1,$2,$3,$4,$5)`,
                [invoice_id, item.product_id, item.qty, item.price, item.tax]
            );
        }

        await client.query("COMMIT");

        invoiceRes.rows[0].items = items;

        res.status(201).json({
            success: true,
            invoice: invoiceRes.rows[0]
        });
    } catch (error) {
        await client.query("ROLLBACK");
        next(error);
    } finally {
        client.release();
    }
};



const getInvoices = async (req, res, next) => {
    try {
        const invoices = await invoiceService.getInvoices(req.user.id);
        res.status(200).json({
            success: true,
            invoices
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInvoice,
    getInvoices
};
