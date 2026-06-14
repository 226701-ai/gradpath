const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET ALL
router.get("/", async (req, res) => {
    const result = await pool.query(`
        SELECT i.*, s.name AS student_name 
        FROM internships i
        JOIN students s ON i.student_id = s.student_id
    `);
    res.json(result.rows);
});

// POST NEW
router.post("/", async (req, res) => {
    const { student_id, company_name, rating } = req.body;
    await pool.query(
        "INSERT INTO internships (student_id, company_name, rating) VALUES ($1, $2, $3)",
        [student_id, company_name, rating]
    );
    res.json({ success: true });
});

// DELETE
router.delete("/:id", async (req, res) => {
    await pool.query("DELETE FROM internships WHERE id = $1", [req.params.id]);
    res.json({ success: true });
});

module.exports = router;