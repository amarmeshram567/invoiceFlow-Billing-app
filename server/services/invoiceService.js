const pool = require("../config/db")


exports.createInvoice = async (data) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        let subtotal = 0, cgst = 0, sgst = 0, igst = 0;
        for (const item of data.items) {
            subtotal += item.price * item.qty;
            cgst += (item.price * item.qty * (item.tax / 2)) / 100;
            sgst += (item.price * item.qty * (item.tax / 2)) / 100;
        }
        const total = subtotal + cgst + sgst - (data.discount || 0);

        const invNo = await client.query(
            `SELECT COALESCE(MAX(invoice_number),0)+1 AS num 
       FROM invoices WHERE business_id=$1`,
            [data.business_id]
        );

        const invoiceRes = await client.query(
            `INSERT INTO invoices 
       (business_id, customer_id, invoice_number, subtotal, cgst, sgst, igst, discount, total_amount, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'UNPAID') RETURNING *`,
            [
                data.business_id,
                data.customer_id, // make sure key matches table
                invNo.rows[0].num,
                subtotal,
                cgst,
                sgst,
                igst,
                data.discount || 0,
                total
            ]
        );

        for (const item of data.items) {
            await client.query(
                `INSERT INTO invoice_items (invoice_id, product_id, quantity, price, tax_percent)
         VALUES ($1,$2,$3,$4,$5)`,
                [invoiceRes.rows[0].id, item.product_id, item.qty, item.price, item.tax]
            );
        }

        await client.query("COMMIT");
        return invoiceRes.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
};


exports.getInvoices = async (userId) => {
    try {
        const businessRes = await pool.query(
            `SELECT id FROM businesses WHERE user_id=$1`,
            [userId]
        );
        if (!businessRes.rows.length) return [];

        const businessId = businessRes.rows[0].id;

        const invoicesRes = await pool.query(
            `SELECT * FROM invoices WHERE business_id=$1 ORDER BY created_at DESC`,
            [businessId]
        );

        const invoices = invoicesRes.rows;
        if (!invoices.length) return [];

        // Fetch all items in one query
        const itemsRes = await pool.query(
            `SELECT * FROM invoice_items WHERE invoice_id = ANY($1::uuid[])`,
            [invoices.map(inv => inv.id)]
        );

        const itemsByInvoice = {};
        itemsRes.rows.forEach(item => {
            if (!itemsByInvoice[item.invoice_id]) itemsByInvoice[item.invoice_id] = [];
            itemsByInvoice[item.invoice_id].push(item);
        });

        invoices.forEach(inv => {
            inv.items = itemsByInvoice[inv.id] || [];
        });

        return invoices;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

