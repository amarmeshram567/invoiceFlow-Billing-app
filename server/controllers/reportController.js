const pool = require("../config/db")



exports.dailySales = async (req, res, next) => {
    try {
        const result = await pool.query(
            `
            SELECT 
                DATE(created_at) as date,
                COALESCE(SUM(total_amount),0) as total
            FROM invoices
            WHERE business_id = (
                SELECT id FROM businesses WHERE user_id=$1
            )
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at)
            `,
            [req.user.id]
        );

        res.json({
            success: true,
            daily_sales: result.rows.map(r => ({
                date: r.date,
                total: Number(r.total)
            }))
        });

    } catch (error) {
        next(error);
    }
};




exports.monthlySales = async (req, res, next) => {
    try {
        const result = await pool.query(
            `
            SELECT  
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as invoices,
                COALESCE(SUM(total_amount),0) as revenue
            FROM invoices
            WHERE business_id = (
                SELECT id FROM businesses WHERE user_id=$1
            )
            GROUP BY month
            ORDER BY month
            `,
            [req.user.id]
        );

        res.json({
            success: true,
            monthly_sales: result.rows.map(r => ({
                month: new Date(r.month).toLocaleString("default", { month: "short" }),
                revenue: Number(r.revenue),
                invoices: Number(r.invoices)
            }))
        });

    } catch (error) {
        next(error);
    }
};



exports.outstanding = async (req, res, next) => {
    try {
        const result = await pool.query(
            `
            SELECT 
                i.id,
                i.invoice_number,
                i.total_amount,
                i.status,
                c.name as customer_name,
                COALESCE(SUM(p.amount),0) as amount_paid
            FROM invoices i
            JOIN customers c ON c.id = i.customer_id
            LEFT JOIN payments p ON p.invoice_id = i.id
            WHERE i.business_id = (
                SELECT id FROM businesses WHERE user_id=$1
            )
            AND i.status != 'PAID'
            GROUP BY i.id, c.name
            ORDER BY i.created_at DESC
            `,
            [req.user.id]
        );

        res.json({
            success: true,
            outstanding: result.rows.map(r => ({
                id: r.id,
                invoiceNumber: `INV-${new Date().getFullYear()}-${String(r.invoice_number).padStart(3, "0")}`,
                customerName: r.customer_name,
                total: Number(r.total_amount),
                amountPaid: Number(r.amount_paid),
                status: r.status
            }))
        });

    } catch (error) {
        next(error);
    }
};
