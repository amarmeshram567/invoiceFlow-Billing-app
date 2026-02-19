const pool = require("../config/db");



const createCustomer = async (req, res, next) => {
    try {
        const { name, phone, email, gst_number, address } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: "Name and phone are required",
            });
        }

        const business = await pool.query(
            `SELECT id FROM businesses WHERE user_id=$1`,
            [req.user.id]
        );

        if (!business.rows.length) {
            return res.status(404).json({
                success: false,
                message: "Business not found for this user",
            });
        }

        const result = await pool.query(
            `INSERT INTO customers 
       (business_id, name, phone, email, gst_number, address)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [business.rows[0].id, name, phone, email, gst_number, address]
        );

        res.status(201).json({
            success: true,
            message: "Customer created",
            customer: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
};


const getCustomers = async (req, res, next) => {
    try {

        console.log("User from token:", req.user);


        const { page = 1, limit = 10, search = '' } = req.query;

        const offset = (page - 1) * limit;

        const result = await pool.query(
            `
            SELECT * FROM customers 
            WHERE business_id = (SELECT id FROM businesses WHERE user_id=$1)
            AND name LIKE $2
            ORDER BY created_at DESC
            LIMIT $3 OFFSET $4
            `,
            [req.user.id, `%${search}%`, limit, offset]
        );

        res.json({
            success: true,
            message: "Customer fetched",
            customers: result.rows
        })

        console.log("Fetched customers:", result.rows)

    } catch (error) {
        next(error)
    }
}

const getCustomerById = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT * FROM customers WHERE id=$1`,
            [req.params.id]
        );
        res.json(result.rows[0])
    } catch (error) {
        next(error)
    }
}

// const updateCustomer = async (req, res, next) => {
//     try {
//         const { name, phone, email, gst_number, address } = req.body;

//         const customer = await pool.query(
//             `UPDATE customers SET 
//             name=$1, phone=$2, email=$3, gst_number=$4, address=$5
//             WHERE id=$6`,
//             [name, phone, email, gst_number, address, req.params.id]
//         )

//         if (!customer.rowCount) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Customer not found"
//             });
//         }


//         res.json({
//             success: true,
//             message: "Customer updated",
//             customer
//         })


//     } catch (error) {
//         next(error)
//     }
// }

const updateCustomer = async (req, res, next) => {
    try {
        const { name, phone, email, gst_number, address } = req.body;

        const result = await pool.query(
            `UPDATE customers SET 
                name=$1, phone=$2, email=$3, gst_number=$4, address=$5
            WHERE id=$6
            RETURNING *`,
            [name, phone, email, gst_number, address, req.params.id]
        );

        if (!result.rowCount) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.json({
            success: true,
            message: "Customer updated",
            customer: result.rows[0]  // return the updated row
        });

    } catch (error) {
        next(error);
    }
}


const deleteCustomer = async (req, res, next) => {
    try {

        await pool.query(
            `DELETE FROM customers WHERE id=$1`,
            [req.params.id]
        )

        res.json({
            success: true,
            message: "Customer deleted"
        })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
}