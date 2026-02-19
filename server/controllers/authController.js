const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const pool = require('../config/db');



const register = async (req, res, next) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await pool.query(
            `SELECT id FROM users WHERE email=$1`,
            [email]
        );

        if (existingUser.rows.length) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await pool.query(
            `INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email
            `,
            [name, email, hashed]
        );


        const business = await pool.query(
            `
            INSERT INTO businesses (user_id, business_name)
            VAlUES ($1, $2)
            RETURNING id, business_name
            `,
            [user.rows[0].id, `${name}'s Business`]
        )

        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        //console.log("Registered user:", user.rows[0]);

        res.status(201).json({
            success: true,
            message: "User created",
            user: user.rows[0],
            business: business.rows[0],
            token
        })
    } catch (error) {
        next(error)
    }
}


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Check user
        const result = await pool.query(
            `SELECT id, name, email, password FROM users WHERE email=$1`,
            [email]
        );

        if (!result.rows.length) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Remove password before sending response
        delete user.password;

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
            token
        });

    } catch (error) {
        next(error);
    }
};



module.exports = {
    register,
    login
}