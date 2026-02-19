const pool = require("../config/db");



exports.addPayment = async (req, res, next) => {
    try {
        const { invoice_id, amount, mode, note } = req.body;


        const invoiceCheck = await pool.query(
            `SELECT id FROM invoices 
                WHERE id = $1 AND business_id = (
                    SELECT id FROM businesses WHERE user_id = $2
            )`,
            [invoice_id, req.user.id]
        );

        if (!invoiceCheck.rows.length) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized invoice access"
            });
        }


        await pool.query(
            `INSERT INTO payments (invoice_id, amount, mode, note)
            VALUES ($1, $2, $3, $4)`,
            [invoice_id, amount, mode, note || null]
        );

        await pool.query(
            `
            UPDATE invoices SET status =
                CASE 
                    WHEN (SELECT SUM(amount) FROM payments WHERE invoice_id=$1)
                        >= total_amount THEN 'PAID'
                    ELSE 'PARTIAL'
                END 
                WHERE id=$1
            `,
            [invoice_id]
        );

        res.json({
            success: true,
            message: "Payment added"
        })

    } catch (error) {
        next(error)
    }
}


exports.getPayments = async (req, res, next) => {
    try {

        const { rows } = await pool.query(`
            SELECT 
                p.id,
                p.invoice_id,
                p.amount,
                p.mode,
                p.note,
                p.created_at,
                i.invoice_number,
                c.name AS customer_name
            FROM payments p
            JOIN invoices i ON i.id = p.invoice_id
            JOIN customers c ON c.id = i.customer_id
            WHERE i.business_id = (
                SELECT id FROM businesses WHERE user_id = $1
            )
            ORDER BY p.created_at DESC
        `, [req.user.id]);


        const formatted = rows.map((p) => ({
            id: p.id,
            invoiceId: p.invoice_id,
            invoiceNumber: `INV-2026-${String(p.invoice_number).padStart(3, "0")}`,
            customerName: p.customer_name,
            amount: Number(p.amount),
            mode: p.mode,
            date: p.created_at.toISOString().split("T")[0],
            note: p.note || "",
        }));

        res.json({
            success: true,
            payments: formatted
        });

    } catch (error) {
        next(error);
    }
};


exports.getPaymentMode = async (req, res, next) => {
    try {


        const { rows } = await pool.query(`
            SELECT mode, SUM(p.amount) as amount
            FROM payments p
            JOIN invoices i ON i.id = p.invoice_id
            WHERE i.business_id = (
                SELECT id FROM businesses WHERE user_id = $1
            )
            GROUP BY mode
        `, [req.user.id]);



        console.log("Payment mode breakdown:", rows);

        res.json({
            success: true,
            paymentMode: rows.map(r => ({
                mode: r.mode,
                amount: Number(r.amount)
            }))
        })

    } catch (error) {
        next(error)
    }
}
