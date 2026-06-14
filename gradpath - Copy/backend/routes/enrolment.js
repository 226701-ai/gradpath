const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =======================
   GET ALL ENROLMENTS
======================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.student_id,
        s.matric,
        s.name AS student_name,
        c.course_code,
        c.course_name,
        e.grade
      FROM enrolment e
      JOIN students s
        ON e.student_id = s.student_id
      JOIN course c
        ON e.course_code = c.course_code
      ORDER BY s.name
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

/* =======================
   ADD / UPDATE ENROLMENT
======================= */
router.post("/", async (req, res) => {
  try {
    const { student_id, course_code, grade } = req.body;

    // Define valid grades
   // In enrolment.js (backend)
const validGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

    // Validation Check
    if (!student_id || !course_code || !grade) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    if (!validGrades.includes(grade)) {
      return res.status(400).json({ error: "Invalid grade selected" });
    }

    const result = await pool.query(
      `
      INSERT INTO enrolment (student_id, course_code, grade)
      VALUES ($1, $2, $3)
      ON CONFLICT (student_id, course_code)
      DO UPDATE SET grade = EXCLUDED.grade
      RETURNING *
      `,
      [student_id, course_code, grade]
    );

    res.json({ success: true, message: "Enrolment saved", data: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   DELETE ENROLMENT
======================= */
router.delete("/:student_id/:course_code", async (req, res) => {
  try {

    const { student_id, course_code } = req.params;

    await pool.query(
      `
      DELETE FROM enrolment
      WHERE student_id = $1
      AND course_code = $2
      `,
      [student_id, course_code]
    );

    res.json({
      success: true,
      message: "Enrolment deleted successfully"
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;