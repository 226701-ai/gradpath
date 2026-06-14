const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(
            `
            SELECT
                s.student_id,
                s.name,
                s.matric,
                s.programme,

                COALESCE(
                    SUM(a.score),
                    0
                ) AS employability_score

            FROM students s

            LEFT JOIN student_activities sa
            ON s.student_id = sa.student_id

            LEFT JOIN activities a
            ON sa.activity_id = a.activity_id

            WHERE s.student_id = $1

            GROUP BY
                s.student_id,
                s.name,
                s.matric,
                s.programme
            `,
            [id]
        );

        res.json(result.rows[0]);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});

module.exports = router;