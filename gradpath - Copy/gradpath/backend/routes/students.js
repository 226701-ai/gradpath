const express = require("express");
const router = express.Router();
const pool = require("../db");

/* =======================
   GET ALL STUDENTS
======================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM students ORDER BY student_id"
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET students error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   CREATE STUDENT
======================= */
router.post("/", async (req, res) => {
  const { matric, name, email, programme } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO students (matric, name, email, programme)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [matric, name, email, programme]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("POST student error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   UPDATE STUDENT
======================= */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { matric, name, email, programme } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE students
      SET matric = $1,
          name = $2,
          email = $3,
          programme = $4
      WHERE student_id = $5
      RETURNING *
      `,
      [matric, name, email, programme, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("UPDATE student error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =======================
   DELETE STUDENT
======================= */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM student_activities WHERE student_id = $1",
      [id]
    );

    await pool.query(
      "DELETE FROM enrolment WHERE student_id = $1",
      [id]
    );

    await pool.query(
      "DELETE FROM students WHERE student_id = $1",
      [id]
    );

    res.json({ message: "Student deleted successfully" });

  } catch (err) {
    console.error("DELETE student error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;