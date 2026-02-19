const pool = require("../config/db");



exports.updateBusiness = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { business_name, address, phone, gst_number } = req.body;

        if (gst_number && gst_number.length !== 15) {
            return res.status(400).json({
                success: false,
                message: "Invalid GST number"
            });
        }

        const logo_url = req.file ? `/uploads/${req.file.filename}` : undefined;

        console.log("req.file:", req.file);


        const { rows } = await pool.query(
            `UPDATE businesses
             SET 
                business_name = COALESCE($1, business_name),
                address = COALESCE($2, address),
                phone = COALESCE($3, phone),
                gst_number = COALESCE($4, gst_number),
                logo_url = COALESCE($5, logo_url)
             WHERE user_id = $6
             RETURNING *;`,
            [business_name, address, phone, gst_number, logo_url, userId]
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        console.log("Updated business:", rows[0]);

        res.json({
            success: true,
            business: rows[0]
        });

    } catch (error) {
        next(error);
    }
};


exports.getBusiness = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const { rows } = await pool.query(
            `SELECT b.*, u.email
             FROM businesses b
             JOIN users u ON b.user_id = u.id
             WHERE b.user_id = $1`,
            [userId]
        );

        const business = rows[0];
        if (!business) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        console.log("Fetched business:", business); // Debugging line

        res.json({
            success: true,
            business: {
                ...business,
                logo_url: business.logo_url
                    ? `${req.protocol}://${req.get('host')}${business.logo_url}`
                    : null
            }
        });

    } catch (error) {
        next(error);
    }
};



