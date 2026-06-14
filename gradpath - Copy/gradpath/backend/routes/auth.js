const express = require("express");
const router = express.Router();
const pool = require("../db");

/* LOGIN */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            `
            SELECT *
            FROM users
            WHERE username = $1
            AND password = $2
            `,
            [username, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const user = result.rows[0];

        res.json({
            success: true,
            message: "Login successful",
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
                student_id: user.student_id || null
            }
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;