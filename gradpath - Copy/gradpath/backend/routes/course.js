const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =======================
   GET ALL COURSES
======================= */
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM course ORDER BY course_code"
        );

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

/* =======================
   ADD COURSE
======================= */
router.post("/", async (req, res) => {
    const { course_code, course_name, credit_hours } = req.body;

    try {
        const result = await pool.query(
            `
            INSERT INTO course
            (course_code, course_name, credit_hours)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [course_code, course_name, credit_hours]
        );

        res.json({
            success: true,
            message: "Course added successfully",
            data: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

/* =======================
   UPDATE COURSE
======================= */
router.put("/:course_code", async (req, res) => {
    const { course_code } = req.params;
    const { course_name, credit_hours } = req.body;

    try {
        const result = await pool.query(
            `
            UPDATE course
            SET course_name = $1,
                credit_hours = $2
            WHERE course_code = $3
            RETURNING *
            `,
            [course_name, credit_hours, course_code]
        );

        res.json({
            success: true,
            message: "Course updated successfully",
            data: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

/* =======================
   DELETE COURSE
======================= */
router.delete("/:course_code", async (req, res) => {
    const { course_code } = req.params;

    try {
        await pool.query(
            `
            DELETE FROM enrolment
            WHERE course_code = $1
            `,
            [course_code]
        );

        await pool.query(
            `
            DELETE FROM course
            WHERE course_code = $1
            `,
            [course_code]
        );

        res.json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;