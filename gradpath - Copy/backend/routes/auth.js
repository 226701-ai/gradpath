const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =======================
   STUDENT REGISTER
======================= */
router.post("/register-student", async (req, res) => {

    const {
        matric,
        name,
        email,
        programme,
        username,
        password
    } = req.body;

    try {

        // check username
        const usernameCheck = await pool.query(
            `
            SELECT *
            FROM users
            WHERE username = $1
            `,
            [username]
        );

        if (usernameCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Username already exists"
            });
        }

        // create student
        const studentResult = await pool.query(
            `
            INSERT INTO students
            (matric, name, email, programme)
            VALUES ($1, $2, $3, $4)
            RETURNING student_id
            `,
            [matric, name, email, programme]
        );

        const studentId =
            studentResult.rows[0].student_id;

        // create user account
        await pool.query(
            `
            INSERT INTO users
            (username, password, role, student_id)
            VALUES ($1, $2, 'student', $3)
            `,
            [username, password, studentId]
        );

        res.json({
            success: true,
            message: "Student registered successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }
});

/* =======================
   LOGIN
======================= */
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

/* =======================
   FORGOT PASSWORD
======================= */
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    try {
        const result = await pool.query(
            `
            SELECT u.user_id, u.username, s.email
            FROM users u
            JOIN students s
            ON u.student_id = s.student_id
            WHERE s.email = $1
            `,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            });
        }

        const user = result.rows[0];

        console.log("=================================");
        console.log("PASSWORD RESET REQUEST");
        console.log("Username:", user.username);
        console.log("Email:", user.email);
        console.log("Reset link:");
        console.log(`http://localhost:3000/reset.html?user_id=${user.user_id}`);
        console.log("=================================");

        res.json({
            success: true,
            message: "Reset link generated. Please check your CMD terminal."
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/* =======================
   RESET PASSWORD
======================= */
router.post("/reset-password", async (req, res) => {
    const { user_id, password, confirmPassword } = req.body;

    if (!user_id || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters"
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        });
    }

    try {
        const userCheck = await pool.query(
            `
            SELECT *
            FROM users
            WHERE user_id = $1
            `,
            [user_id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Invalid reset link"
            });
        }

        await pool.query(
            `
            UPDATE users
            SET password = $1
            WHERE user_id = $2
            `,
            [password, user_id]
        );

        res.json({
            success: true,
            message: "Password reset successful"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;