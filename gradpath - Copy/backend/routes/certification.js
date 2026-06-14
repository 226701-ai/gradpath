const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =======================
   GET ALL CERTIFICATIONS
   (Joined with students to get names)
======================= */
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, s.name AS student_name 
            FROM certifications c
            JOIN students s ON c.student_id = s.student_id
            ORDER BY s.name
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =======================
   ADD CERTIFICATION
======================= */
router.post("/", async (req, res) => {
    const { student_id, cert_name, grade } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO certifications (student_id, cert_name, grade) 
             VALUES ($1, $2, $3) RETURNING *`,
            [student_id, cert_name, grade]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* =======================
   DELETE CERTIFICATION
======================= */
router.delete("/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM certifications WHERE id = $1", [req.params.id]);
        res.json({ success: true, message: "Certification deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;