const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =======================
   GET ALL OUTCOMES
======================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM learning_outcomes ORDER BY outcome_id"
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

/* =======================
   ADD OUTCOME
======================= */
router.post("/", async (req, res) => {
  const { outcome_name, category } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO learning_outcomes
      (outcome_name, category)
      VALUES ($1, $2)
      RETURNING *
      `,
      [outcome_name, category]
    );

    res.json({
      success: true,
      message: "Learning outcome added successfully",
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

/* =======================
   UPDATE OUTCOME
======================= */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { outcome_name, category } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE learning_outcomes
      SET outcome_name = $1,
          category = $2
      WHERE outcome_id = $3
      RETURNING *
      `,
      [outcome_name, category, id]
    );

    res.json({
      success: true,
      message: "Outcome updated successfully",
      data: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

/* =======================
   DELETE OUTCOME
======================= */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {

    await pool.query(
      `
      DELETE FROM activities
      WHERE outcome_id = $1
      `,
      [id]
    );

    await pool.query(
      `
      DELETE FROM learning_outcomes
      WHERE outcome_id = $1
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Learning outcome deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;