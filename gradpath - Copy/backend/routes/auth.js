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

module.exports = router;