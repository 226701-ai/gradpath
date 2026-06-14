const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =======================
   GET ALL ACTIVITIES
======================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.activity_id,
        a.activity_name,
        a.activity_type,
        a.score,
        a.outcome_id,
        l.outcome_name,
        l.category
      FROM activities a
      JOIN learning_outcomes l
      ON a.outcome_id = l.outcome_id
      ORDER BY a.activity_id
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

/* =======================
   ADD ACTIVITY
======================= */
router.post("/", async (req, res) => {
  const { activity_name, activity_type, score, outcome_id } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO activities
      (activity_name, activity_type, score, outcome_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [activity_name, activity_type, score, outcome_id]
    );

    res.json({
      success: true,
      message: "Activity added successfully",
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

/* =======================
   UPDATE ACTIVITY
======================= */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { activity_name, activity_type, score, outcome_id } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE activities
      SET activity_name = $1,
          activity_type = $2,
          score = $3,
          outcome_id = $4
      WHERE activity_id = $5
      RETURNING *
      `,
      [activity_name, activity_type, score, outcome_id, id]
    );

    res.json({
      success: true,
      message: "Activity updated successfully",
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

/* =======================
   DELETE ACTIVITY
======================= */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM student_activities WHERE activity_id = $1",
      [id]
    );

    await pool.query(
      "DELETE FROM activities WHERE activity_id = $1",
      [id]
    );

    res.json({
      success: true,
      message: "Activity deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;