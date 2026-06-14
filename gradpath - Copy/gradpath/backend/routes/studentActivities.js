const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =======================
   GET ALL STUDENT ACTIVITIES
======================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        sa.student_activity_id,
        s.name AS student_name,
        a.activity_name,
        a.score,
        lo.outcome_name
      FROM student_activities sa
      JOIN students s ON sa.student_id = s.student_id
      JOIN activities a ON sa.activity_id = a.activity_id
      JOIN learning_outcomes lo ON a.outcome_id = lo.outcome_id
      ORDER BY sa.student_activity_id
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("GET student activities error:", err.message);
    res.status(500).json({
      error: err.message
    });
  }
});

/* =======================
   ADD STUDENT ACTIVITY
======================= */
router.post("/", async (req, res) => {
  const { student_id, activity_id } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO student_activities
      (student_id, activity_id, participation_date)
      VALUES ($1, $2, CURRENT_DATE)
      RETURNING *
      `,
      [student_id, activity_id]
    );

    res.json({
      success: true,
      message: "Student activity assigned successfully",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("POST student activity error:", err.message);
    res.status(500).json({
      error: err.message
    });
  }
});

/* =======================
   DELETE STUDENT ACTIVITY
======================= */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `
      DELETE FROM student_activities
      WHERE student_activity_id = $1
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Student activity deleted successfully"
    });

  } catch (err) {
    console.error("DELETE student activity error:", err.message);
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;