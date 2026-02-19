const pool = require("../config/db");


const createProduct = async (req, res, next) => {
    try {

        const { name, price, tax_percent, stock_quantity, hsn_code, unit } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: "Name and price are required",
            });
        }

        const business = await pool.query(
            `SELECT id FROM businesses WHERE user_id=$1`,
            [req.user.id]
        )

        const result = await pool.query(
            `
            INSERT INTO products 
            (business_id, name, price, tax_percent, stock_quantity, hsn_code, unit)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
            `,
            [business.rows[0].id, name, price, tax_percent, stock_quantity, hsn_code, unit]
        );

        res.status(201).json({
            success: true,
            message: "Product created",
            product: result.rows[0]
        })


    } catch (error) {
        next(error)
    }
}


const getProducts = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT * FROM products 
            WHERE business_id  = (SELECT id FROM businesses WHERE user_id=$1)
            `,
            [req.user.id]
        )

        res.json({
            products: result.rows
        })

    } catch (error) {
        next(error)
    }
}


const updateProduct = async (req, res, next) => {
    try {
        const { name, price, tax_percent, stock_quantity, hsn_code, unit } = req.body;

        const result = await pool.query(
            `
            UPDATE products SET 
            name=$1, price=$2, tax_percent=$3, stock_quantity=$4, hsn_code=$5, unit=$6
            WHERE id = $7
            `,
            [name, price, tax_percent, stock_quantity, hsn_code, unit, req.params.id]
        );

        res.json({
            success: true,
            message: "Product updated",
            product: result.rows
        })

    } catch (error) {
        next(error)
    }
}


const deleteProduct = async (req, res, next) => {
    try {

        await pool.query(
            `DELETE FROM products WHERE id=$1`,
            [req.params.id]
        );

        res.json({
            message: "Product deleted"
        })

    } catch (error) {
        next(error)
    }
}


module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
}